import knexfile from "../knexfile";
import Pino from "pino";

const logger = Pino();

const pg = knexfile;

export async function getAllMeals(limit = 10, page = 1) {
    let response
    try {
        response = await pg.select().from('meals').limit(limit).offset(page).orderBy('id_meal', 'desc');
        if(response.length > 0) {
            response = { msg: 'meals found', data: response };
        }
        else{
            response = { msg: 'meals not found' };
        }
    } catch (error) {
        logger.error(error);
        response = {
            msg: 'unable to get all meals',
            error: error
        }
    }
    return response;
}

export async function getMeal(data){
    let response;
    try{
        response = await pg.select()
                            .from('meals')
                            .where(data);

        if(response.length > 0) {
            response = { msg: 'meal found', data: response[0] };
        }
        else{
            response = { msg: 'meal not found' };
        }
    }catch(error){
        logger.error(error);
        response = { msg: 'unable to get meal', error: error };
    }
    return response;
}

export async function insertMeal(data) {
    let response
    try {
        response = await pg.returning(['id_meal', 'meal_photo', 'meal_name', 'meal_description', 'meal_main_type', 'meal_type', 'meal_cost', 'meal_protein', 'meal_calories', 'meal_carbohydrates', 'meal_fats', 'created_at', 'updated_at'])
                            .insert(data)
                            .into('meals');

        if(response.length > 0) {
            response = { msg: 'meal inserted', data: response[0] };
        }
        else{
            response = { msg: 'meal not inserted' };
        }
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to insert meal', error: error };
    }
    return response;
}

export async function updateMeal(data) {
    const updated_at = new Date().toISOString();
    data = { ...data, updated_at };

    const { id_meal } = data;
    delete data.id_meal
    let response
    try {
        response = await pg("meals").returning(['id_meal', 'meal_photo', 'meal_name', 'meal_description', 'meal_main_type', 'meal_type', 'meal_cost', 'meal_protein', 'meal_calories', 'meal_carbohydrates', 'meal_fats', 'updated_at'])
                            .where({ id_meal })
                            .update(data);

        if(response.length > 0) {
            response = { msg: 'meal updated', data: response[0] };
        }
        else{
            response = { msg: 'meal not updated' };
        }
    } catch(error){
        logger.error(error);
        response = { msg: 'unable to update meal', error: error };
    }
    return response;
}

export async function deleteMeal(data) {
    // check if id_meal has recipe associated
    const recipe = await pg.select().from('recipes').where( data );
    
    let recipeDel

    if (recipe.length > 0) {
        try{
            recipeDel = await pg('recipes').returning(['meal_recipe', 'meal_ingredients', 'meal_prep_time']).where({ recipe_id: recipe[0].recipe_id }).del();
        }catch(error){
            logger.error(error);
            recipeDel = { msg: 'unable to delete recipe', error: error };
        }
        if (recipeDel.error) {
            return recipeDel;
        }
    }
    
    let response
    try {
        response = await pg("meals").returning(['id_meal', 'meal_name'])
                            .where(data)
                            .del();
        
        if(response.length > 0) {
            response = { msg: 'meal deleted', data: response[0] };
        }
        else{
            response = { msg: 'meal not deleted' };
        }
    } catch(error){
        logger.error(error);
        response = { msg: 'unable to delete meal', error: error };
    }

    // if(recipeDel.length && !response.error){
    //     response = { ...response[0], ...recipeDel[0] };
    // }

    return response;
}