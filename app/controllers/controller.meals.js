import {
    getMeal,
    insertMeal,
    updateMeal,
    deleteMeal,
    getAllMeals
} from '../services/service.meals'

import Pino from 'pino'

const logger = Pino()

export async function getAllMealsController(req, res) {
    const { page, limit } = req.query
    let { mealIds } = req.query
    if(mealIds){
        try {
            mealIds = JSON.parse(mealIds)
        } catch (error) {
            logger.error(error)
            mealIds = []
        }
    }
    
    const allMeals = await getAllMeals(limit, page, mealIds)
    
    if (allMeals.error) {
        logger.error(allMeals.error)
        return res.status(500).json({
            msg: 'unable to get all meals',
            error: allMeals.error
        })
    }

    return res.status(200).json(allMeals)
}

export async function getMealController(req, res) {
    const {
        id_meal
    } = req.params;

    if (!id_meal) {
        logger.error('id_meal is not defined');
        return res.status(400).json({
            error: 'id_meal is required'
        });
    }

    const meal = await getMeal({
        id_meal
    });

    if (meal.error) {
        logger.error(meal.error);
        return res.status(500).json({
            error: meal.error
        });
    }

    return res.status(200).json(meal);
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

    if (!meal_name || !meal_photo || !meal_description || !meal_type || !meal_cost || !meal_protein || !meal_calories || !meal_carbohydrates || !meal_fats) {
        logger.error('missing some field');
        return res.status(400).json({
            error: 'some fields required are missing'
        });
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

    if (meal.error) {
        logger.error(meal.error);
        return res.status(500).json({
            error: meal.error
        });
    }

    return res.status(200).json(meal);
}

export async function updateMealController(req, res) {
    const {
        name: meal_name,
        picture: meal_photo,
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

    if (!id_meal) {
        logger.error('id_meal is not defined');
        return res.status(400).json({
            error: 'id_meal is required'
        });
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

    if (meal.error) {
        logger.error(meal.error);
        return res.status(500).json({
            error: meal.error
        });
    }

    return res.status(200).json(meal);
}

export async function deleteMealController(req, res) {
    const {
        id_meal
    } = req.params;

    if (!id_meal) {
        logger.error('id_meal is not defined');
        return res.status(400).json({
            error: 'id_meal is required'
        });
    }

    const meal = await deleteMeal({
        id_meal
    });

    if (meal.error) {
        logger.error(meal.error);
        return res.status(500).json({
            error: meal.error
        });
    }

    return res.status(200).json(meal);
}