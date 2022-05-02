import { getIngredient, insertIngredient, updateIngredient, deleteIngredient, getAllIngredients } from '../services/service.ingredients';
import errorResponseJSON from '../errorHandler';

import Pino from 'pino'
import CustomError from '../ErrorResponse';

const logger = Pino()

export async function getAllIngredientsController(req, res){
    try {
        const allIngredients = await getAllIngredients()
        
        if(allIngredients.error){
            logger.error(allIngredients.error)
            return res.status(500).json({ error: allIngredients.error })
        }
    
        return res.status(200).json(allIngredients)
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)   
    }
}

export async function getIngredientController(req, res) {
    const { ingredient_id } = req.params;
    try {
        if (!ingredient_id) {
            logger.error('id_ingredient is not defined');
            throw new CustomError(400, 'id_ingredient is not defined', 'id_ingredient is not defined');
        }
    
        const ingredient = await getIngredient({ ingredient_id });

        return res.status(200).json(ingredient);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)   
    }
}

export async function insertIngredientController(req, res) {
    const { name:ingredient_name, picture:ingredient_picture  } = req.body;

    try {
        if (!ingredient_name || !ingredient_picture ) {
            logger.error('name or picture is not defined');
            throw new CustomError(400, 'name or picture is not defined', 'name or picture is not defined');
        }
    
        const ingredient = await insertIngredient({ ingredient_name, ingredient_picture  });
    
        return res.status(200).json(ingredient);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)   
    }
}

export async function updateIngredientController(req, res) {
    const { ingredient_id } = req.params;
    const { name:ingredient_name, picture:ingredient_picture } = req.body;
    
    try {
        if (!ingredient_id ) throw new CustomError(400, 'id_ingredient is not defined', 'id_ingredient is not defined');
        
        if (!ingredient_name && !ingredient_picture ) throw new CustomError(400, 'name and picture are not defined', 'name and picture are not defined');
        
        const ingredient = await updateIngredient({ ingredient_name, ingredient_picture }, { ingredient_id });
    
        return res.status(200).json(ingredient);        
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)   
    }
}

export async function deleteIngredientController(req, res) {
    const { ingredient_id } = req.params;

    try {
        if (!ingredient_id) throw new CustomError(400, 'id_ingredient is not defined', 'id_ingredient is not defined');
    
        const ingredient = await deleteIngredient({ ingredient_id });
    
        return res.status(200).json(ingredient);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)   
    }
}