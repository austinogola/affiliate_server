const bcrypt = require('bcrypt');


const hashPassword=(rawPassword)=>{
    return new Promise((resolve, reject)=>{
        //Generate salt
        bcrypt.genSalt(10, (err, Salt) => {
            bcrypt.hash(rawPassword, Salt, function(err, hash) {
                if(err){
                    consol.log(err)
                }
                if(hash){
                    resolve(hash)
                }
            });
        })
    })
}

const comparePassword=(rawPassword,hashedPassword)=>{
    return new Promise((resolve, reject)=>{
        //compare
        bcrypt.compare(rawPassword, hashedPassword, function(err, result) {
            if (result) {
                resolve(true)
            }
            else{
                resolve(false)
            }
        });
    })
}

module.exports={hashPassword,comparePassword}