import express from "express";

import { getAllMealsController, getMealController, insertMealController, updateMealController, deleteMealController } from "../controllers/controller.meals";

export const routerMeals = express.Router();

routerMeals.get("/", getAllMealsController);

routerMeals.get("/:id_meal", getMealController);

routerMeals.post("/", insertMealController);

routerMeals.patch("/:id_meal", updateMealController);

routerMeals.delete("/:id_meal", deleteMealController);