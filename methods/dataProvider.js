const bcrypt = require('bcrypt');
const tokenHandler=require('./token')
const UserHandler=require('../db_handlers/users')
const AccountHandler=require('../db_handlers/accounts')
const CreditHandler=require('../db_handlers/credits')
const AffiliateHandler=require('../db_handlers/affiliates')


const getProfileData=async(token)=>{
    return new Promise(async(resolve, reject) => {
        let email,amazonId,userId
        let tokenDetails=await tokenHandler.verifyToken(token)
        let user=await UserHandler.getUserById(tokenDetails.userId)
        email=user.email
        userId=tokenDetails.userId
        amazonId=user.amazonId
        const account= await AccountHandler.getAccountByUserId(userId)
        const {totalCredits,creditHistory}=account
        const yourCreds=await CreditHandler.getCreditsByOwner(userId)

        // const {products}=await getProfileProducts(tokenDetails.userId)
        // const {purchases,credits}=await getProfilePurchasesAndCredits(tokenDetails.userId)
        // resolve({ email,amazonId,products,credits,purchases,userId})
        resolve({ email,amazonId,userId,totalCredits,yourCreds})
        const affiliates= await AffiliateHandler.getUserAffiliates(userId)
        console.log(affiliates);
    })
}

const getProfilePurchasesAndCredits=async(userId)=>{
    return new Promise(async(resolve, reject) => {
        let account=await AccountHandler.getAccountByUserId(userId)
        const {purchases,credits}=account
        resolve({ purchases,credits })
    })
}
const getProfileProducts=async(userId)=>{
    return new Promise(async(resolve, reject) => {
        let account=await AccountHandler.getAccountByUserId(userId)
        const {products}=account
        resolve({products })
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

module.exports={getProfileData}