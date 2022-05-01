import { getIngredient, insertIngredient, updateIngredient, deleteIngredient, getAllIngredients } from '../services/service.ingredients';

import Pino from 'pino'

const logger = Pino()

export async function getAllIngredientsController(req, res){
    const allIngredients = await getAllIngredients()
    
    if(allIngredients.error){
        logger.error(allIngredients.error)
        return res.status(500).json({ error: allIngredients.error })
    }

    return res.status(200).json(allIngredients)
}

export async function getIngredientController(req, res) {
    const { ingredient_id } = req.params;

    if (!ingredient_id) {
        logger.error('id_ingredient is not defined');
        return res.status(400).json({ error: 'id_ingredient is required' });
    }

    const ingredient = await getIngredient({ ingredient_id });

    if (ingredient.error) {
        logger.error(ingredient.error);
        return res.status(500).json({ error: ingredient.error });
    }

    return res.status(200).json(ingredient);
}

export async function insertIngredientController(req, res) {
    const { name:ingredient_name, picture:ingredient_picture  } = req.body;

    if (!ingredient_name || !ingredient_picture ) {
        logger.error('name or picture is not defined');
        return res.status(400).json({ error: 'name or picture are required' });
    }

    const ingredient = await insertIngredient({ ingredient_name, ingredient_picture  });

    if (ingredient.error) {
        logger.error(ingredient.error);
        return res.status(500).json({ error: ingredient.error });
    }

    return res.status(200).json(ingredient);
}

export async function updateIngredientController(req, res) {
    const { ingredient_id } = req.params;
    const { name:ingredient_name, picture:ingredient_picture } = req.body;
    
    if (!ingredient_id ) {
        logger.error('id_ingredient is not defined');
        return res.status(400).json({ error: 'id_ingredient are required' });
    }

    const ingredient = await updateIngredient({ ingredient_name, ingredient_picture }, { ingredient_id });

    if (ingredient.error) {
        logger.error(ingredient.error);
        return res.status(500).json({ error: ingredient.error });
    }

    return res.status(200).json(ingredient);
}

export async function deleteIngredientController(req, res) {
    const { ingredient_id } = req.params;

    if (!ingredient_id) {
        logger.error('id_ingredient is not defined');
        return res.status(400).json({ error: 'id_ingredient is required' });
    }

    const ingredient = await deleteIngredient({ ingredient_id });

    if(ingredient.msg === 'unable to delete ingredient, belongs to recipe') {
        logger.error(ingredient.msg);
        return res.status(400).json({ msg: ingredient.msg, error: 'id_ingredient can not be deleted' });
    }

    if (ingredient.error) {
        logger.error(ingredient.error);
        return res.status(500).json({ error: ingredient.error });
    }

    return res.status(200).json(ingredient);
}