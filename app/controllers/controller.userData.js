import {
    getUserData,
    updateUserData
} from '../services/service.userData';

import Pino from 'pino'
import errorResponseJSON from '../errorHandler';
import errorBuilderJSON from '../errorHandlerV2';
import CustomError from '../ErrorResponse';

const logger = Pino()

export async function getUserDataController(req, res) {
    const {
        id_user
    } = req.params;

    let resJSON

    try {
        if (!id_user) {
            throw new CustomError(400, 'Missing required fields', 'Bad request');
        }
    
        const response = await getUserData({
            id_user
        });

        resJSON = {
            status: 200,
            message: response.message,
            data: response.data
        }
    } catch (error) {
        logger.error(error)
        resJSON = errorBuilderJSON(error)
    }
    return res.status(resJSON.status).json(resJSON);
}

export async function updateUserDataController(req, res) {
    const {
        profilePicture: profile_picture,
        name,
        birthDate: birth_date,
        sex,
        bmi,
        height,
        weight,
        physicalActivity: physical_activity,
        isVegetarian: is_vegetarian,
        goal,
        mealsQty: meals_qty
    } = req.body;

    const {
        id_user
    } = req.params;

    try {
        if (!id_user) {
            logger.error('id_user is not defined');
            throw new CustomError(400, 'Missing required fields', 'Bad request');
        }
    
        const response = await updateUserData({
            profile_picture,
            name,
            birth_date,
            sex,
            bmi,
            height,
            weight,
            physical_activity,
            is_vegetarian,
            goal,
            meals_qty
        }, {id_user});
        
        return res.status(200).json(response);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}