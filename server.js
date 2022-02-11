import express from 'express';
import {routerUsers} from './app/routes/routes.user';
import {routerIngredients} from './app/routes/routes.ingredients';
import {routerMeals} from './app/routes/routes.meals';
import {routerRecipes} from './app/routes/routes.recipe';

// App
const app = express();

app.use(express.json());
app.use("/users", routerUsers);
app.use("/ingredients", routerIngredients)
app.use("/meals", routerMeals)
app.use("/recipes", routerRecipes)

export default app;