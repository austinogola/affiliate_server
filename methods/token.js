const jwt=require('jsonwebtoken')
require('dotenv').config()

const newToken=(userId,amazonId,maxAge)=>{
    return new Promise((resolve, reject)=>{
        const token=jwt.sign(
            {userId,amazonId},
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
            // console.log(TokenDetails)
          resolve(TokenDetails);
        }
      });
    });
  };



module.exports={newToken,verifyToken}