import express from 'express';

import { searchUsers, insertUserController, updateUserController, deleteUserController } from './app/controllers/controller.users';
import { getIngredientController, insertIngredientController, updateIngredientController, deleteIngredientController } from './app/controllers/controller.ingredients';

// App
const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
    // Todo: add middleware
    next();
});

app.get('/users', searchUsers);

app.post('/users', insertUserController);

app.patch('/users', updateUserController);

app.delete('/users', deleteUserController);

app.get('/ingredients/:ingredient_id', getIngredientController)

app.post('/ingredients/', insertIngredientController)

app.patch('/ingredients/:ingredient_id', updateIngredientController)

app.delete('/ingredients/:ingredient_id', deleteIngredientController)

export default app;