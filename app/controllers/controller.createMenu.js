import { algoMenu, getMenuCart } from '../services/service.createMenu'

import Pino from 'pino'
import errorResponseJSON from '../errorHandler';
import CustomError from '../ErrorResponse';

const logger = Pino()

export async function getUserMenu(req, res) {
    const { user_id: userId } = req.params;

    try {
        if(!userId) {
            throw new CustomError(400, 'Missing required fields', 'Bad request');
        }
        const userMenu = await algoMenu(userId);
        
        return res.status(200).json(userMenu);
    } catch (err) {
        logger.error(err);
        return errorResponseJSON(err, res)
    }
}

export async function getUserCart(req, res) {
    const { user_id: userId } = req.params;

    try {
        if(!userId) {
            throw new CustomError(400, 'Missing required fields', 'Bad request');
        }

        const userCart = await getMenuCart(userId);
        
        return res.status(200).json(userCart);
    } catch (err) {
        logger.error(err);
        return errorResponseJSON(err, res)
    }
}