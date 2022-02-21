import { getUserPref, updateUserPref } from '../services/service.userPref';

import Pino from 'pino'

const logger = Pino()

export async function getUserPrefController(req, res) {
    const { id_user } = req.params;

    if (!id_user) {
        logger.error('id_user is not defined');
        return res.status(400).json({
            error: 'id_user is required'
        });
    }
    
    const userPref = await getUserPref({ id_user });

    if (userPref.error) {
        logger.error(userPref.error);
        return res.status(500).json({
            error: userPref.error
        });
    }

    return res.status(200).json(userPref);
}

export async function updateUserPrefController(req, res) {
    const { menuJSON: menu_json, monday, tuesday } = req.body;
    const { id_user } = req.params;

    if (!id_user) {
        logger.error('id_user is not defined');
        return res.status(400).json({
            error: 'id_user is required'
        });
    }

    if (!menu_json || !monday || !tuesday) {
        logger.error('menu_json is not defined');
        return res.status(400).json({
            error: 'menu_json is required'
        });
    }

    const userPref = await updateUserPref({menu_json, monday, tuesday}, { id_user });

    if (userPref.error) {
        logger.error(userPref.error);
        return res.status(500).json({
            error: userPref.error
        });
    }
   
    return res.status(200).json(userPref);
}