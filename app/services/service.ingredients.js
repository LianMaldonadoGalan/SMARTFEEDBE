/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'

const logger = Pino()

const pg = knexfile

export async function getIngredient(data) {
    let response
    try {
        response = await pg.select('ingredient_id', 'ingredient_name', 'ingredient_picture', 'created_at', 'updated_at').from('ingredients').where(data);
    } catch (error) {
        logger.error(error);
        response = { error: 'unable to get ingredient' };
    }
    return response;
}

export async function insertIngredient(data) {
    let response
    try {
        response = await pg.returning(['ingredient_id', 'ingredient_name', 'ingredient_picture', 'created_at']).insert(data).into('ingredients');
    } catch (error) {
        logger.error(error);
        response = { error: 'unable to insert ingredient' };
    }
    return response;
}

export async function updateIngredient(data) {
    const { ingredient_id, ingredient_name, ingredient_picture } = data;
    const updated_at = new Date().toISOString();
    let response
    try {
        response = await pg("ingredients").returning(['ingredient_id', 'ingredient_name', 'ingredient_picture', 'updated_at']).where({ ingredient_id }).update({ ingredient_name, ingredient_picture, updated_at })
    } catch (error) {
        logger.error(error);
        response = { error: 'unable to update ingredient' }
    }
    
    return response
}

export async function deleteIngredient(data) {
    let response
    try {
        response = await pg("ingredients").returning(['ingredient_id', 'ingredient_name']).where( data ).del()
    }
    catch (error) {
        logger.error(error);
        response = { error: 'unable to delete ingredient' }
    }
    return response
}