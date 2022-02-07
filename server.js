import express from 'express';

import { searchUsers, insertUserController, updateUserController, deleteUserController } from './app/controllers/controller.users';

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

export default app;