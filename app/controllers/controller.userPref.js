import { getUserPref, updateUserPref } from '../services/service.userPref';

import Pino from 'pino'
import errorResponseJSON from '../errorHandler';
import CustomError from '../ErrorResponse';

const logger = Pino()

export async function getUserPrefController(req, res) {
    const { id_user } = req.params;
    try {
        if (!id_user) {
            throw new CustomError(400, 'Missing required fields', 'Bad request');
        }
        
        const userPref = await getUserPref({ id_user });
    
        return res.status(200).json(userPref);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function updateUserPrefController(req, res) {
    const { menuJSON: menu_json, monday, tuesday } = req.body;
    const { id_user } = req.params;

    try {
        if (!id_user) {
            throw new CustomError(400, 'Missing required fields', 'Bad request');
        }
    
        if (!menu_json) {
            throw new CustomError(400, 'menu_json is not defined', 'Bad request');
        }
    
        const userPref = await updateUserPref({menu_json, monday, tuesday}, { id_user });
       
        return res.status(200).json(userPref);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }

}