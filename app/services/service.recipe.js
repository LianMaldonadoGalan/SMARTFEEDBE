/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'
import CustomError from "../ErrorResponse";

const logger = Pino()

const pg = knexfile

export async function getRecipe(data) {
    let response = await pg.select().from('recipes').where(data);

    if(response.error) throw new CustomError(500, "Internal error retrieving recipe", response.error);

    return response.length > 0 ? { message: 'recipe found', data: response[0] } : { message: 'recipe not found' };
}

export async function getRecipeUsingMealId(data) {
    let response = await pg.select().from('recipes').where(data);

    if(response.error) throw new CustomError(500, "Internal error retrieving recipe", response.error);

    return response.length > 0 ? { message: 'recipe found', data: response } : { message: 'recipe not found' };
}

export async function insertRecipe(data) {
    let response
    const ingredientsFound = await checkIngredients(data.meal_ingredients);
    if(!ingredientsFound) {
        throw new CustomError(400, "Ingredients not found", "Bad request");
    }

    response = await pg.returning(['recipe_id', 'id_meal', 'meal_ingredients', 'meal_recipe', 'meal_prep_time', 'created_at', 'updated_at']).insert(data).into('recipes');

    if(response.error) throw new CustomError(500, "Internal error inserting recipe", response.error);

    return response.length > 0 ? { message: 'recipe inserted', data: response[0] } : { message: 'recipe not inserted' };
}

async function checkIngredients(ingredientsArray) {
    let ingredientsFound
    const returningIngredient = ['ingredient_id', 'ingredient_name', 'ingredient_picture']
    let arrayParsed = []

    try {
        arrayParsed = JSON.parse(ingredientsArray)
    } catch (error) {
        logger.error(error, 'Error parsing ingredients');
        arrayParsed = []
    }

    ingredientsFound = await pg.select(returningIngredient).from('ingredients').whereIn('ingredient_id', arrayParsed);

    return ingredientsFound.length === arrayParsed.length
} 

export async function updateRecipe(data, queryParams) {
    const { recipe_id } = queryParams;
    const updated_at = new Date().toISOString();

    let response = await pg("recipes").returning(['recipe_id', 'id_meal', 'meal_ingredients', 'meal_recipe', 'meal_prep_time', 'updated_at']).where({ recipe_id }).update({...data, updated_at })

    if(response.error) throw new CustomError(500, "Internal error updating recipe", response.error);

    return response.length > 0 ? { message: 'recipe updated', data: response[0] } : { message: 'recipe not updated' };
}

export async function deleteRecipe(data) {
    let response = await pg("recipes").returning(['recipe_id', 'id_meal', 'meal_ingredients', 'meal_recipe', 'meal_prep_time']).where( data ).del()

    if(response.error) throw new CustomError(500, "Internal error deleting recipe", response.error);

    return response.length > 0 ? { message: 'recipe deleted', data: response[0] } : { message: 'recipe not deleted' };
}