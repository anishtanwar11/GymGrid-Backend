import jwt from 'jsonwebtoken';

export const verifyTokenByUserName = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token ) return res.json({status: false, message: 'No token provided'});

        const decoded = await jwt.verify(token, 'your_secret_key');
        console.log("decoded token -", decoded);
        req.userId = decoded.userId; // Extract user ID from decoded token
        req.userName = decoded.userName;// Extract username from decoded token

        next();
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Failed to authenticate token' });
    }
};

export const verifyTokenByUserId = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token){
            return res.json({status: false, message: 'No token provided'});
        }
        const decoded = await jwt.verify(token, 'your_secret_key');
        req.userId = decoded.userId;
        const tokenUserId = decoded.userId;
        const tokenUserName = decoded.userName;
        const requestedUserName = req.params.userName;

        console.log( tokenUserName ,"," ,requestedUserName);

        if(tokenUserName !== requestedUserName){
            return res.status(409).json({ status: false, message: 'Unauthorized access' });
        }
        req.userId = tokenUserId;
        next()
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Failed to authenticate token' });
    }
}