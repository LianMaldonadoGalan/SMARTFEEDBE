import { getRecipe, getRecipeUsingMealId, insertRecipe, updateRecipe, deleteRecipe } from '../services/service.recipe'

import Pino from 'pino'
import errorResponseJSON from '../errorHandler';
import CustomError from '../ErrorResponse';

const logger = Pino()

export async function getRecipeController(req, res){
    const { recipe_id } = req.params;
    try {
        const recipe = await getRecipe({ recipe_id });
    
        return res.status(200).json(recipe)
    } catch (error) {
        logger.error(error);
        return errorResponseJSON(error, res);
    }
}

export async function getRecipeUsingMealIdController(req, res){
    const { id_meal } = req.params;
    try {
        const recipe = await getRecipeUsingMealId({ id_meal });

        return res.status(200).json(recipe)
    } catch (error) {
        logger.error(error);
        return errorResponseJSON(error, res);
    }
}

export async function insertRecipeController(req, res) {
    const { mealId:id_meal, mealIngredients:meal_ingredients, mealRecipe:meal_recipe, mealPrepTime:meal_prep_time } = req.body;
    
    try {
        if (!id_meal || !meal_ingredients || !meal_recipe || !meal_prep_time) {
            throw new CustomError(400, 'Missing required fields', 'Bad request');
        }
    
        const recipe = await insertRecipe({ id_meal, meal_ingredients, meal_recipe, meal_prep_time });
    
        return res.status(200).json(recipe);
    } catch (error) {
        logger.error(error);
        return errorResponseJSON(error, res);
    }
}

export async function updateRecipeController(req, res) {
    const { recipe_id } = req.params;
    const { mealIngredients:meal_ingredients, mealRecipe:meal_recipe, mealPrepTime:meal_prep_time } = req.body;
    try {
        if (!recipe_id) {
            throw new CustomError(400, 'Missing recipe id', 'Bad request');
        }
    
        const recipe = await updateRecipe({ meal_ingredients, meal_recipe, meal_prep_time }, { recipe_id });

        return res.status(200).json(recipe);
    } catch (error) {
        logger.error(error);
        return errorResponseJSON(error, res);
    }
}

export async function deleteRecipeController(req, res) {
    const { recipe_id } = req.params;
    try {
        if (!recipe_id) {
            throw new CustomError(400, 'Missing recipe id', 'Bad request');
        }
    
        const recipe = await deleteRecipe({ recipe_id });

        return res.status(200).json(recipe);       
    } catch (error) {
        logger.error(error);
        return errorResponseJSON(error, res);
    }
}