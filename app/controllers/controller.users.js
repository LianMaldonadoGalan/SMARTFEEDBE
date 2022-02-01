import { getUser, insertUser } from '../services/service.users';

export async function searchUsers(req, res) {
    const { email, passwd } = req.body;
    
    if(!email || !passwd) {
        res.status(400).json({ error: 'email or password are required' });
    }

    const response = await getUser({ email, passwd });

    if(response.error) res.status(500).json({ error: response.error });

    return res.status(200).json(response);
}

export async function insertUserController(req, res) {
    const { email, passwd, isAdmin } = req.body;
    if(!email || !passwd) {
        res.status(400).json({ error: 'email or password are required' });
    }
    
    const userInserted = isAdmin ? await insertUser({ email, passwd, isAdmin }) : await insertUser({ email, passwd });

    if(userInserted.error) 
        res.status(500).json({ error: userInserted.error });
    
    return res.status(200).json(userInserted);
}