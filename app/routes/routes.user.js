import express from 'express';

import { searchUsers, insertUserController, updateUserController, deleteUserController, getUserByEmailController } from '../controllers/controller.users';
import { verifyToken } from '../middlewares/auth';

export const routerUsers = express.Router();

routerUsers.post('/login', searchUsers);

routerUsers.post('/register', insertUserController);

routerUsers.patch('/', verifyToken, updateUserController);

routerUsers.delete('/', verifyToken, deleteUserController);

routerUsers.get('/', verifyToken, getUserByEmailController);