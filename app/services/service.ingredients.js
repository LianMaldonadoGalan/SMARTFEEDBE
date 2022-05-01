/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'

const logger = Pino()

const pg = knexfile

export async function getAllIngredients() {
    let response
    try{
        response = await pg.select().from('ingredients');
        if(response.length > 0) {
            response = { msg: 'ingredients found', data: response };
        }
        else{
            response = { msg: 'ingredients not found' };
        }
    }catch(error){
        logger.error(error)
        response = { msg: 'Unable to get all ingredients', error }
    }
    return response
}

export async function getIngredient(data) {
    let response
    try {
        response = await pg.select('ingredient_id', 'ingredient_name', 'ingredient_picture', 'created_at', 'updated_at').from('ingredients').where(data);
        if(response.length > 0) {
            response = { msg: 'ingredient found', data: response[0] };
        }
        else{
            response = { msg: 'ingredient not found' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to get ingredient', error };
    }
    return response;
}

export async function insertIngredient(data) {
    let response
    try {
        response = await pg.returning(['ingredient_id', 'ingredient_name', 'ingredient_picture', 'created_at']).insert(data).into('ingredients');
        if(response.length > 0) {
            response = { msg: 'ingredient inserted', data: response[0] };
        }
        else{
            response = { msg: 'ingredient not inserted' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to insert ingredient', error };
    }
    return response;
}

export async function updateIngredient(data, queryParams) {
    const { ingredient_id } = queryParams;
    const updated_at = new Date().toISOString();
    let response
    try {
        response = await pg("ingredients").returning(['ingredient_id', 'ingredient_name', 'ingredient_picture', 'updated_at']).where({ ingredient_id }).update({ ...data, updated_at })
        if(response.length > 0) {
            response = { msg: 'ingredient updated', data: response[0] };
        }
        else{
            response = { msg: 'ingredient not updated' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to update ingredient', error };
    }
    
    return response
}

export async function deleteIngredient(data) {
    let response
    try {
        const isInRecipes = await pg.select('*')
            .from('recipes')
            .whereLike('meal_ingredients', `%,${data.ingredient_id},%`)
            .orWhereRaw(`"meal_ingredients" like ?`, [`%,${data.ingredient_id}]%]`])
            .orWhereRaw(`"meal_ingredients" like ?`, [`%[${data.ingredient_id},%]`])
            
        if(isInRecipes.length > 0) return response = { msg: 'unable to delete ingredient, belongs to recipe'};

        response = await pg("ingredients").returning(['ingredient_id', 'ingredient_name']).where( data ).del()
        if(response.length > 0) {
            response = { msg: 'ingredient deleted', data: response[0] };
        }
        else{
            response = { msg: 'ingredient not deleted' };
        }
    }
    catch (error) {
        logger.error(error);
        response = { msg: 'unable to delete ingredient', error };
    }
    return response
}