import express from "express";

import { getRecipeController, getRecipeUsingMealIdController, insertRecipeController, updateRecipeController, deleteRecipeController } from "../controllers/controller.recipe";

export const routerRecipes = express.Router();

routerRecipes.get('/:recipe_id', getRecipeController);

routerRecipes.get('/meal/:id_meal', getRecipeUsingMealIdController);

routerRecipes.post('/', insertRecipeController);

routerRecipes.patch('/:recipe_id', updateRecipeController);

routerRecipes.delete('/:recipe_id', deleteRecipeController);