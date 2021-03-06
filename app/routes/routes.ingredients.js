import express from "express";

import { getIngredientController, insertIngredientController, updateIngredientController, deleteIngredientController, getAllIngredientsController } from "../controllers/controller.ingredients";

export const routerIngredients = express.Router();

routerIngredients.get('/', getAllIngredientsController)

routerIngredients.get('/:ingredient_id', getIngredientController)

routerIngredients.post('/', insertIngredientController)

routerIngredients.patch('/:ingredient_id', updateIngredientController)

routerIngredients.delete('/:ingredient_id', deleteIngredientController)