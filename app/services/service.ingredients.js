/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'
import CustomError from "../ErrorResponse";

const logger = Pino()

const pg = knexfile

export async function getAllIngredients() {
    let response = await pg.select().from('ingredients');
    
    if (response.error) throw new CustomError(500, "Internal error retrieving ingredients", response.error);
    
    return response.length > 0 ? { message: 'ingredients found', data: response } : { message: 'ingredients not found' };
}

export async function getIngredient(data) {
    let response = await pg.select('ingredient_id', 'ingredient_name', 'ingredient_picture', 'created_at', 'updated_at').from('ingredients').where(data);
    
    if (response.error) throw new CustomError(500, "Internal error retrieving ingredient", response.error);

    return response.length > 0 ? { message: 'ingredient found', data: response[0] } : { message: 'ingredient not found' };
}

export async function insertIngredient(data) {
    let response = await pg.returning(['ingredient_id', 'ingredient_name', 'ingredient_picture', 'created_at']).insert(data).into('ingredients');

    if (response.error) throw new CustomError(500, "Internal error inserting ingredient", response.error);
    
    return response.length > 0 ? { message: 'ingredient inserted', data: response[0] } : { message: 'ingredient not inserted' };
}

export async function updateIngredient(data, queryParams) {
    const { ingredient_id } = queryParams;
    const updated_at = new Date().toISOString();
    
    let response = await pg("ingredients").returning(['ingredient_id', 'ingredient_name', 'ingredient_picture', 'updated_at']).where({ ingredient_id }).update({ ...data, updated_at })
    
    if(response.error) throw new CustomError(500, "Internal error updating ingredient", response.error);
    
    return response.length > 0 ? { message: 'ingredient updated', data: response[0] } : { message: 'ingredient not updated' };
}

export async function deleteIngredient(data) {
    let response
    const isInRecipes = await pg.select('*')
        .from('recipes')
        .whereLike('meal_ingredients', `%,${data.ingredient_id},%`)
        .orWhereRaw(`"meal_ingredients" like ?`, [`%,${data.ingredient_id}]%]`])
        .orWhereRaw(`"meal_ingredients" like ?`, [`%[${data.ingredient_id},%]`])
        
    if(isInRecipes.length > 0) throw new CustomError(400, "Ingredient is in recipes", "Ingredient is in recipes");

    response = await pg("ingredients").returning(['ingredient_id', 'ingredient_name']).where( data ).del()
    
    if(response.error) throw new CustomError(500, "Internal error deleting ingredient", response.error);

    return response.length > 0 ? { message: 'ingredient deleted', data: response[0] } : { message: 'ingredient not deleted' };
}