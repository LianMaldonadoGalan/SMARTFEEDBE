import knexfile from "../knexfile";
import Pino from "pino";
import axios from "axios";
import CustomError from "../ErrorResponse";

const logger = Pino();

const pg = knexfile;

export async function getAllMeals(limit = 10, page = 1, mealIds = []) {
    let response

    if(Array.isArray(mealIds) && mealIds.length > 0) {
        response = await pg.select().from('meals').whereIn('id_meal', mealIds).orderBy('id_meal', 'asc');
    }
    else{
        response = await pg.select().from('meals').limit(limit).offset(page).orderBy('id_meal', 'desc');
    }

    if(response.error) throw new CustomError(500, "Internal error retrieving meals", response.error);

    return response.length > 0 ? { message: 'meals found', data: response } : { message: 'meals not found' };
}

export async function getMeal(data){
    let response = await pg.select()
                        .from('meals')
                        .where(data);

    if (response.error) throw new CustomError(500, "Internal error retrieving meal", response.error);

    return response.length > 0 ? { message: 'meal found', data: response[0] } : { message: 'meal not found' };
}

export async function insertMeal(data) {
    let response
    // call data mining api to get meal main type
    const mainTypeFromModel = await getMainMealTypeFromModel(data);
    if(mainTypeFromModel !== '')
        data['meal_main_type'] = mainTypeFromModel;
    
    response = await pg.returning(['id_meal', 'meal_photo', 'meal_name', 'meal_description', 'meal_main_type', 'meal_type', 'meal_cost', 'meal_protein', 'meal_calories', 'meal_carbohydrates', 'meal_fats', 'created_at', 'updated_at'])
                        .insert(data)
                        .into('meals');

    if (response.error) throw new CustomError(500, "Internal error inserting meal", response.error);

    return response.length > 0 ? { message: 'meal inserted', data: response[0] } : { message: 'meal not inserted' };
}

export async function updateMeal(data) {
    const updated_at = new Date().toISOString();
    data = { ...data, updated_at };

    const { id_meal } = data;
    delete data.id_meal
    let response
    response = await pg("meals").returning(['id_meal', 'meal_photo', 'meal_name', 'meal_description', 'meal_main_type', 'meal_type', 'meal_cost', 'meal_protein', 'meal_calories', 'meal_carbohydrates', 'meal_fats', 'updated_at'])
                        .where({ id_meal })
                        .update(data);

    if(response.error) throw new CustomError(500, "Internal error updating meal", response.error);

    return response.length > 0 ? { message: 'meal updated', data: response[0] } : { message: 'meal not updated' };
}

export async function deleteMeal(data) {
    // check if id_meal has recipe associated
    const recipe = await pg.select().from('recipes').where( data );
    
    let recipeDel

    if (recipe.length > 0) {
        recipeDel = await pg('recipes').returning(['meal_recipe', 'meal_ingredients', 'meal_prep_time']).where({ recipe_id: recipe[0].recipe_id }).del();
        
        if (recipeDel.error) throw new CustomError(500, "Internal error deleting meal", recipeDel.error);
        logger.info({recipeDel}, 'recipe deleted');
    }
    
    let response = await pg("meals").returning(['id_meal', 'meal_name'])
                        .where(data)
                        .del();
    
    if (response.error) throw new CustomError(500, "Internal error deleting meal", response.error);

    return response.length > 0 ? { message: 'meal deleted', data: response[0] } : { message: 'meal not deleted' };
}

async function getMainMealTypeFromModel(data){
    const { meal_protein, meal_calories, meal_carbohydrates, meal_fats } = data;
    
    // send data to model as json
    const mainMealTypeModel = await axios.post('https://smart-feed-data-mining.herokuapp.com/predict', {
        "proteins": meal_protein,
        "calories": meal_calories,
        "carbos": meal_carbohydrates,
        "fats": meal_fats
        })
    
    if(!Object.prototype.hasOwnProperty.call(mainMealTypeModel, 'data')){
        return ''
    }
    return mainMealTypeModel.data.prediction;   
}