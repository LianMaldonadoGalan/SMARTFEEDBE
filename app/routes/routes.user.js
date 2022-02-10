import express from 'express';

import { searchUsers, insertUserController, updateUserController, deleteUserController } from '../controllers/controller.users';

export const routerUsers = express.Router();

routerUsers.get('/', searchUsers);

routerUsers.post('/', insertUserController);

routerUsers.patch('/', updateUserController);

routerUsers.delete('/', deleteUserController);