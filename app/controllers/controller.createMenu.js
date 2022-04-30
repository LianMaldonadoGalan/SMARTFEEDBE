import { algoMenu, getMenuCart } from '../services/service.createMenu'

import Pino from 'pino'

const logger = Pino()

export async function getUserMenu(req, res) {
    const { user_id: userId } = req.params;

    try {
        if(!userId) {
            logger.error('user_id is not defined');
            return res.status(400).json({ error: 'user_id is required' });
        }
        const userMenu = await algoMenu(userId);

        if(userMenu.error) {
            logger.error(userMenu.error);
            return res.status(500).json({ error: userMenu.error });
        }
        
        return res.status(200).json(userMenu);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ error: err });
    }
}

export async function getUserCart(req, res) {
    const { user_id: userId } = req.params;

    try {
        if(!userId) {
            logger.error('user_id is not defined');
            return res.status(400).json({ error: 'user_id is required' });
        }

        const userCart = await getMenuCart(userId);

        if(userCart.error) {
            logger.error(userCart.error);
            return res.status(500).json({ error: userCart.error });
        }
        
        return res.status(200).json(userCart);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ error: err });
    }
}