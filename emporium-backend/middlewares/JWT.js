const {sign, verify} = require("jsonwebtoken");
require('dotenv').config();

const createToken = (user) => {
    const accessToken = sign({username: user.username, id: user.user_id},process.env.ACCESS_TOKEN_STRING);

    return accessToken;
};

const validateToken = async (req,res,next) => {
    const accessToken = req.cookies["access-token"];

    if(!accessToken) return res.status(400).json({error: "User not connected"});

    try{
        const validToken = verify(accessToken, process.env.ACCESS_TOKEN_STRING);
        if(validToken){
            req.authenticated = true;
            req.user_id = validToken.id;
            return next();
        }
    }catch(err){
        return res.status(500).json({error: err});
    }
}

module.exports = {createToken, validateToken};