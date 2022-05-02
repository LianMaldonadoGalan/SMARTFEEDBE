import { getUser, insertUser, updateUser, deleteUser, getUserByEmail } from '../services/service.users';

import Pino from 'pino'
import jwt from 'jsonwebtoken';
import errorResponseJSON from '../errorHandler';
import CustomError from '../ErrorResponse';

const logger = Pino()
// eslint-disable-next-line no-undef
const { JWTSECRET } = process.env

export async function searchUsers(req, res) {
    const { email, passwd } = req.body;
    
    try {
        if(!email || !passwd) {
            throw new CustomError(400, 'email or passwd is not defined', 'Bad request');
        }
        const user = {
            email: email.toLowerCase(),
            passwd
        }
        const response = await getUser(user);
    
        if(Object.prototype.hasOwnProperty.call(response, 'data')){
            // create a token
            const token = jwt.sign({ id: response.data.id_user, email: response.data.email, admin: response.data.isAdmin }, JWTSECRET);
            response.token = token;
            return res.status(200).json(response);
        }
    
        return res.status(200).json({msgToken: "Unable to get jwt token", response});
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function insertUserController(req, res) {
    const { email, passwd, isAdmin } = req.body;
    
    try {
        if(!email || !passwd) {
            throw new CustomError(400, 'email or passwd is not defined', 'Bad request');
        }
        
        const oldUser = await getUserByEmail({ email });
        
        if(Object.prototype.hasOwnProperty.call(oldUser, 'data')) {
            throw new CustomError(400, 'user already exists', 'Bad request');
        }
        
        const user = {
            email: email.toLowerCase(),
            passwd,
        }
        
        const userInserted = isAdmin ? await insertUser({ ...user, isAdmin }) : await insertUser(user);
        
        if(Object.prototype.hasOwnProperty.call(userInserted, 'data')) {
            // create JWT token
            const token = jwt.sign({ id: userInserted.data.id_user, email: userInserted.data.email }, JWTSECRET, { expiresIn: '1d' });
            userInserted.token = token;
            return res.status(200).json(userInserted);
        }
        
        return res.status(200).json({msgToken: "Unable to get jwt token" , userInserted});
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function updateUserController(req, res) {
    const { id_user, email, passwd, isAdmin } = req.body;

    try {
        if(!id_user || !email || !passwd) {
            throw new CustomError(400, 'id_user, email or passwd is not defined', 'Bad request');
        }
    
        const userUpdated = isAdmin ? await updateUser({ id_user, email, passwd, isAdmin }) : await updateUser({ id_user, email, passwd });
    
        return res.status(200).json(userUpdated);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function deleteUserController(req, res) {
    const { id_user } = req.body;

    try {
        if(!id_user) {
            throw new CustomError(400, 'id_user is not defined', 'Bad request');
        }
    
        const userDeleted = await deleteUser({ id_user });
    
        return res.status(200).json(userDeleted);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}

export async function getUserByEmailController(req, res) {
    const { email } = req.body;

    try {
        if(!email) {
            throw new CustomError(400, 'email is not defined', 'Bad request');
        }
    
        const user = await getUserByEmail({ email });
    
        return res.status(200).json(user);
    } catch (error) {
        logger.error(error)
        return errorResponseJSON(error, res)
    }
}