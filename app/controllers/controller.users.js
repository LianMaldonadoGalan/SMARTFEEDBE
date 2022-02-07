import { getUser, insertUser, updateUser, deleteUser } from '../services/service.users';

import Pino from 'pino'

const logger = Pino()

export async function searchUsers(req, res) {
    const { email, passwd } = req.body;
    
    if(!email || !passwd) {
        logger.error('email or passwd is not defined');
        return res.status(400).json({ error: 'email or password are required' });
    }

    const response = await getUser({ email, passwd });

    if(response.error) {
        logger.error(response.error);
        return res.status(500).json({ error: response.error });
    }

    return res.status(200).json(response);
}

export async function insertUserController(req, res) {
    const { email, passwd, isAdmin } = req.body;
    if(!email || !passwd) {
        logger.error('email or passwd is not defined');
        return res.status(400).json({ error: 'email or password are required' });
    }
    
    const userInserted = isAdmin ? await insertUser({ email, passwd, isAdmin }) : await insertUser({ email, passwd });

    if(userInserted.error) {
        logger.error(userInserted.error);
        return res.status(500).json({ error: userInserted.error });
    }
    
    return res.status(200).json(userInserted);
}

export async function updateUserController(req, res) {
    const { id_user, email, passwd, isAdmin } = req.body;
    if(!id_user || !email || !passwd) {
        logger.error('id_user, email or passwd is not defined');
        return res.status(400).json({ error: 'id_user, email or password are required' });
    }

    const userUpdated = isAdmin ? await updateUser({ id_user, email, passwd, isAdmin }) : await updateUser({ id_user, email, passwd });

    if(userUpdated.error){
        logger.error(userUpdated.error);
        return res.status(500).json({ error: userUpdated.error });
    }

    return res.status(200).json(userUpdated);
}

export async function deleteUserController(req, res) {
    const { id_user } = req.body;
    if(!id_user) {
        logger.error('id_user is not defined');
        return res.status(400).json({ error: 'id_user is required' });
    }

    const userDeleted = await deleteUser({ id_user });

    if(userDeleted.error){
        logger.error(userDeleted.error);
        return res.status(500).json({ error: userDeleted.error });
    }

    return res.status(200).json(userDeleted);
}
