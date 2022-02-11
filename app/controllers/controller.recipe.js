import { getRecipe, insertRecipe, updateRecipe, deleteRecipe } from '../services/service.recipe'

import Pino from 'pino'

const logger = Pino()

export async function getRecipeController(req, res){
    const { recipe_id } = req.params;
    const recipe = await getRecipe({ recipe_id });

    if(recipe.error){
        logger.error(recipe.error)
        return res.status(500).json({ error: recipe.error })
    }

    return res.status(200).json(recipe)
}

export async function insertRecipeController(req, res) {
    const { mealId:id_meal, mealIngredients:meal_ingredients, mealRecipe:meal_recipe, mealPrepTime:meal_prep_time } = req.body;
    
    if (!id_meal || !meal_ingredients || !meal_recipe || !meal_prep_time) {
        logger.error('id_meal, meal_ingredients, meal_recipe or meal_prep_time is not defined');
        return res.status(400).json({ error: 'id_meal, meal_ingredients, meal_recipe or meal_prep_time are required' });
    }

    const recipe = await insertRecipe({ id_meal, meal_ingredients, meal_recipe, meal_prep_time });

    if (recipe.error) {
        logger.error(recipe.error);
        return res.status(500).json({ error: recipe.error });
    }

    return res.status(200).json(recipe);
}

export async function updateRecipeController(req, res) {
    const { recipe_id } = req.params;
    const { mealIngredients:meal_ingredients, mealRecipe:meal_recipe, mealPrepTime:meal_prep_time } = req.body;

    if (!recipe_id) {
        logger.error('recipe_id is not defined');
        return res.status(400).json({ error: 'recipe_id is required' });
    }

    const recipe = await updateRecipe({ meal_ingredients, meal_recipe, meal_prep_time }, { recipe_id });

    if (recipe.error) {
        logger.error(recipe.error);
        return res.status(500).json({ error: recipe.error });
    }

    return res.status(200).json(recipe);
}

export async function deleteRecipeController(req, res) {
    const { recipe_id } = req.params;

    if (!recipe_id) {
        logger.error('id_meal is not defined');
        return res.status(400).json({ error: 'id_meal is required' });
    }

    const recipe = await deleteRecipe({ recipe_id });

    if (recipe.error) {
        logger.error(recipe.error);
        return res.status(500).json({ error: recipe.error });
    }

    return res.status(200).json(recipe);
}