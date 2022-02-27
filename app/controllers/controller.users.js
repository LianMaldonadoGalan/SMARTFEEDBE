import { getUser, insertUser, updateUser, deleteUser, getUserByEmail } from '../services/service.users';

import Pino from 'pino'
import jwt from 'jsonwebtoken';

const logger = Pino()
// eslint-disable-next-line no-undef
const { JWTSECRET } = process.env

export async function searchUsers(req, res) {
    const { email, passwd } = req.body;
    
    if(!email || !passwd) {
        logger.error('email or passwd is not defined');
        return res.status(400).json({ error: 'email or password are required' });
    }
    const user = {
        email: email.toLowerCase(),
        passwd
    }
    const response = await getUser(user);

    if(response.error) {
        logger.error(response.error);
        return res.status(500).json({ error: response.error });
    }

    if(Object.prototype.hasOwnProperty.call(response, 'data')){
        // create a token
        const token = jwt.sign({ id: response.data.id_user, email: response.data.email, admin: response.data.isAdmin }, JWTSECRET);
        response.token = token;
        return res.status(200).json(response);
    }

    return res.status(200).json({msgToken: "Unable to get jwt token", response});
}

export async function insertUserController(req, res) {
    const { email, passwd, isAdmin } = req.body;
    if(!email || !passwd) {
        logger.error('email or passwd is not defined');
        return res.status(400).json({ error: 'email or password are required' });
    }
    
    const oldUser = await getUserByEmail({ email });

    if(oldUser.error) {
        logger.error(oldUser.error);
        return res.status(500).json({ error: oldUser.error });
    }

    if(Object.prototype.hasOwnProperty.call(oldUser, 'data')) {
        logger.error('user already exists');
        return res.status(409).json({ error: 'user already exists' });
    }

    const user = {
        email: email.toLowerCase(),
        passwd,
    }

    const userInserted = isAdmin ? await insertUser({ ...user, isAdmin }) : await insertUser(user);

    
    if(userInserted.error) {
        logger.error(userInserted.error);
        return res.status(500).json({ error: userInserted.error });
    }
    
    if(Object.prototype.hasOwnProperty.call(userInserted, 'data')) {
        // create JWT token
        const token = jwt.sign({ id: userInserted.data.id_user, email: userInserted.data.email }, JWTSECRET, { expiresIn: '1d' });
        userInserted.token = token;
        return res.status(200).json(userInserted);
    }

    return res.status(200).json({msgToken: "Unable to get jwt token" , userInserted});
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

export async function getUserByEmailController(req, res) {
    const { email } = req.body;
    if(!email) {
        logger.error('email is not defined');
        return res.status(400).json({ error: 'email is required' });
    }

    const user = await getUserByEmail({ email });

    if(user.error){
        logger.error(user.error);
        return res.status(500).json({ error: user.error });
    }

    return res.status(200).json(user);
}