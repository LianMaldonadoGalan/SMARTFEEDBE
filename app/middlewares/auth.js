import jwt from 'jsonwebtoken'
// import moment from 'moment';
// eslint-disable-next-line no-undef
const { JWTSECRET } = process.env;

export const verifyToken = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const token = req.headers.authorization.split(" ")[1];
    if(!token) {
        return res.status(401).json({ error: 'Token is required' });
    }
    try{
        const payloadDecoded = jwt.verify(token, JWTSECRET, (err, decoded) => {
            if(err) {
                return res.status(401).json({ error: 'Token is invalid' });
            }
            return decoded;
        });
        // if (payloadDecoded.exp <= moment().unix()) {
        //     return res.status(401).send({ message: "Token has expired" });
        //   }
        req.user = payloadDecoded;
        return next();
    }catch(err){
        return res.status(500).json({ error: err });
    }
};
