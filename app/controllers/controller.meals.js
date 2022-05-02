import {
    getMeal,
    insertMeal,
    updateMeal,
    deleteMeal,
    getAllMeals
} from '../services/service.meals'


import Pino from 'pino'
import errorResponseJSON from '../errorHandler'
import CustomError from '../ErrorResponse'

const logger = Pino()

export async function getAllMealsController(req, res) {
    const { page, limit } = req.query
    let { mealIds } = req.query
    
    try {
        if(mealIds){
            try {
                mealIds = JSON.parse(mealIds)
            } catch (error) {
                logger.error(error)
                mealIds = []
            }
        }
        
        const allMeals = await getAllMeals(limit, page, mealIds)
    
        return res.status(200).json(allMeals)    
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function getMealController(req, res) {
    const {
        id_meal
    } = req.params;

    try {
        if (!id_meal) {
            throw new CustomError(400, 'id_meal is required', 'Bad Request')
        }
    
        const meal = await getMeal({
            id_meal
        });
    
        return res.status(200).json(meal);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function insertMealController(req, res) {
    const {
        name: meal_name,
        photo: meal_photo,
        description: meal_description,
        type: meal_type,
        cost: meal_cost,
        protein: meal_protein,
        calories: meal_calories,
        carbohydrates: meal_carbohydrates,
        fats: meal_fats
    } = req.body;

    try {
        if (!meal_name || !meal_photo || !meal_description || !meal_type || !meal_cost || !meal_protein || !meal_calories || !meal_carbohydrates || !meal_fats) {
            throw new CustomError(400, 'All fields are required', 'Bad Request')
        }
        
        const meal = await insertMeal({
            meal_name,
            meal_photo,
            meal_description,
            meal_type,
            meal_cost,
            meal_protein,
            meal_calories,
            meal_carbohydrates,
            meal_fats
        });
    
        return res.status(200).json(meal);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function updateMealController(req, res) {
    const {
        name: meal_name,
        photo: meal_photo,
        description: meal_description,
        type: meal_type,
        cost: meal_cost,
        protein: meal_protein,
        calories: meal_calories,
        carbohydrates: meal_carbohydrates,
        fats: meal_fats
    } = req.body;

    const {
        id_meal
    } = req.params

    try {
        if (!id_meal) {
            throw new CustomError(400, 'id_meal is required', 'Bad Request')
        }
    
        const meal = await updateMeal({
            id_meal,
            meal_name,
            meal_photo,
            meal_description,
            meal_type,
            meal_cost,
            meal_protein,
            meal_calories,
            meal_carbohydrates,
            meal_fats
        });
    
        return res.status(200).json(meal);    
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function deleteMealController(req, res) {
    const {
        id_meal
    } = req.params;

    try {
        if (!id_meal) {
            throw new CustomError(400, 'id_meal is required', 'Bad Request')
        }
    
        const meal = await deleteMeal({
            id_meal
        });
    
        return res.status(200).json(meal);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}