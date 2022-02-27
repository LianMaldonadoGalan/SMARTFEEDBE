/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'

const logger = Pino()

const pg = knexfile

export async function getRecipe(data) {
    let response
    try {
        response = await pg.select().from('recipes').where(data);
        if(response.length > 0) {
            response = { msg: 'recipe found', data: response[0] };
        }
        else{
            response = { msg: 'recipe not found' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to get recipe', error };
    }
    return response;
}

export async function getRecipeUsingMealId(data) {
    let response
    try {
        response = await pg.select().from('recipes').where(data);
        if(response.length > 0) {
            response = { msg: 'recipe found', data: response };
        }
        else{
            response = { msg: 'recipe not found' };
        }
    }
    catch (error) {
        logger.error(error);
        response = { msg: 'unable to get recipe', error };
    }
    return response;
}

export async function insertRecipe(data) {
    let response
    try {
        response = await pg.returning(['recipe_id', 'id_meal', 'meal_ingredients', 'meal_recipe', 'meal_prep_time', 'created_at', 'updated_at']).insert(data).into('recipes');
        if(response.length > 0) {
            response = { msg: 'recipe inserted', data: response[0] };
        }
        else{
            response = { msg: 'recipe not inserted' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to insert recipe', error };
    }
    return response;
}

export async function updateRecipe(data, queryParams) {
    const { recipe_id } = queryParams;
    const updated_at = new Date().toISOString();

    let response
    try {
        response = await pg("recipes").returning(['recipe_id', 'id_meal', 'meal_ingredients', 'meal_recipe', 'meal_prep_time', 'updated_at']).where({ recipe_id }).update({...data, updated_at })
        if(response.length > 0) {
            response = { msg: 'recipe updated', data: response[0] };
        }
        else{
            response = { msg: 'recipe not updated' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to update recipe', error };
    }
    
    return response
}


export async function deleteRecipe(data) {
    let response
    try {
        response = await pg("recipes").returning(['recipe_id', 'id_meal', 'meal_ingredients', 'meal_recipe', 'meal_prep_time']).where( data ).del()
        if(response.length > 0) {
            response = { msg: 'recipe deleted', data: response[0] };
        }
        else{
            response = { msg: 'recipe not deleted' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to delete recipe', error };
    }
    return response
}