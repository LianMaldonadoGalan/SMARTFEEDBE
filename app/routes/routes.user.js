import express from 'express';

import { searchUsers, insertUserController, updateUserController, deleteUserController, getUserByEmailController } from '../controllers/controller.users';

export const routerUsers = express.Router();

routerUsers.post('/login', searchUsers);

routerUsers.post('/register', insertUserController);

routerUsers.patch('/', updateUserController);

routerUsers.delete('/', deleteUserController);

routerUsers.get('/', getUserByEmailController);