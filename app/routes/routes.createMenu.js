import express from 'express';

import { getUserMenu } from '../controllers/controller.createMenu';

export const routerMenu = express.Router();

routerMenu.get('/:user_id', getUserMenu);