import { getUserPref, updateUserPref } from '../services/service.userPref';

import Pino from 'pino'
import errorResponseJSON from '../errorHandler';
import CustomError from '../ErrorResponse';
import errorBuilderJSON from '../errorHandlerV2';

const logger = Pino()

export async function getUserPrefController(req, res) {
    const { id_user } = req.params;
    let resJSON
    try {
        if (!id_user) {
            throw new CustomError(400, 'Missing required fields', 'Bad request');
        }
        
        const userPref = await getUserPref({ id_user });
        
        resJSON = {
            status: 200,
            message: userPref.message,
            data: userPref.data
        }
    } catch (error) {
        logger.error(error)
        resJSON = errorBuilderJSON(error)
    }
    return res.status(resJSON.status).json(resJSON);
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