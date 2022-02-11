import express from "express";

import { getRecipeController, insertRecipeController, updateRecipeController, deleteRecipeController } from "../controllers/controller.recipe";

export const routerRecipes = express.Router();

routerRecipes.get('/:recipe_id', getRecipeController);

routerRecipes.post('/', insertRecipeController);

routerRecipes.patch('/:recipe_id', updateRecipeController);

routerRecipes.delete('/:recipe_id', deleteRecipeController);