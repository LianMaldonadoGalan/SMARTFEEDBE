import express from 'express';

import { getUserMenu, getUserCart } from '../controllers/controller.createMenu';

export const routerMenu = express.Router();

routerMenu.get('/:user_id', getUserMenu);

routerMenu.get('/cart/:user_id', getUserCart);