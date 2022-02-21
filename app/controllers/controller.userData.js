import {
    getUserData,
    updateUserData
} from '../services/service.userData';

import Pino from 'pino'

const logger = Pino()

export async function getUserDataController(req, res) {
    const {
        id_user
    } = req.params;

    if (!id_user) {
        logger.error('id_user is not defined');
        return res.status(400).json({
            error: 'id_user is required'
        });
    }

    const response = await getUserData({
        id_user
    });

    if (response.error) {
        logger.error(response.error);
        return res.status(500).json({
            error: response.error
        });
    }

    return res.status(200).json(response);
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

    if (!id_user) {
        logger.error('id_user is not defined');
        return res.status(400).json({
            error: 'id_user is required'
        });
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
    
    if(response.error){
        logger.error(response.error);
        return res.status(500).json({
            error: response.error
        });
    }

    return res.status(200).json(response);
}