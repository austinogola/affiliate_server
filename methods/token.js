const jwt=require('jsonwebtoken')
require('dotenv').config()

const newToken=(userId,accountId,maxAge)=>{
    return new Promise((resolve, reject)=>{
        const token=jwt.sign(
            {accountId,userId},
            process.env.jwtSecret,
            {
                expiresIn:maxAge
            }
        )
        resolve(token)
    })
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.jwtSecret, (error, TokenDetails) => {
        if (error) {
          // Token verification failed (e.g., expired or invalid signature)
          resolve(false);
        } else {
          // Token verification successful
          resolve(TokenDetails);
        }
      });
    });
  };



module.exports={newToken,verifyToken}