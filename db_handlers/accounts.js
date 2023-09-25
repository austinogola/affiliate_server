const Account=require('../model/account')
const User=require('../model/user')

const addToAccounts=async(accountDetails)=>{
    return new Promise((resolve, reject) => {
        try {
            let acc=new Account(accountDetails)
            acc.save().then(account=>{
                resolve(account)
            })
            
        } catch (error) {
            resolve(error.message)
        }
        
    })
    
}

const checkExisting=async(email)=>{
    return new Promise(async(resolve, reject) => {
        const emailExists=await Account.findOne({email})
        if(emailExists) {
            resolve(true)
        }
        else{
            resolve(false)
        }
    })
    
}

const getAccountByUserId=async(userId)=>{
    return new Promise(async(resolve, reject) => {
        const accountOwner=await Account.findOne({userId})
        if(accountOwner) {
            resolve(accountOwner)
        }
        else{
            resolve(false)
        }
    })
}




module.exports={addToAccounts,checkExisting,getAccountByUserId}