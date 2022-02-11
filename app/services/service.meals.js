import knexfile from "../knexfile";
import Pino from "pino";

const logger = Pino();

const pg = knexfile;

export async function getAllMeals() {
    let response
    try {
        response = await pg.select().from('meals');
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
    }catch(error){
        logger.error(error);
        response = { msg: 'unable to get meal', error: error };
    }
    return response;
}

export async function insertMeal(data) {
    let response
    try {
        response = await pg.returning(['id_meal', 'meal_photo', 'meal_name', 'meal_description', 'meal_type', 'meal_cost', 'meal_protein', 'meal_calories', 'meal_carbohydrates', 'meal_fats', 'created_at', 'updated_at'])
                            .insert(data)
                            .into('meals');
    } catch (error) {
        logger.error(error);
        response = { msg: 'unable to insert meal', error: error };
    }
    return response;
}

export async function updateMeal(data) {
    const { id_meal } = data;
    delete data.id_meal
    let response
    try {
        response = await pg("meals").returning(['id_meal', 'meal_photo', 'meal_name', 'meal_description', 'meal_type', 'meal_cost', 'meal_protein', 'meal_calories', 'meal_carbohydrates', 'meal_fats', 'updated_at'])
                            .where({ id_meal })
                            .update(data);
    } catch(error){
        logger.error(error);
        response = { msg: 'unable to update meal', error: error };
    }
    return response;
}

export async function deleteMeal(data) {
    let response
    try {
        response = await pg("meals").returning(['id_meal', 'meal_name'])
                            .where(data)
                            .del();
    } catch(error){
        logger.error(error);
        response = { msg: 'unable to delete meal', error: error };
    }
    return response;
}