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

const getAccountProducts=async(id)=>{
    return new Promise(async(resolve, reject) => {
        const accountOwner=await Account.findOne({_id:id})
        if(accountOwner) {
            const {products}=accountOwner
            resolve({products})
        }
        else{
            resolve(false)
        }
    })
}

const getAccountPurchasesAndCredits=async(id)=>{
    return new Promise(async(resolve, reject) => {
        const accountOwner=await Account.findOne({_id:id})
        if(accountOwner) {
            const {purchases,credits}=accountOwner
            resolve({purchases,credits})
        }
        else{
            resolve(false)
        }
    })
}

// (err, updatedRecord) => {
//     if (err) {
//       console.error('Error updating record:', err);
//       resolve(false)
//     } else {
//       console.log(updatedRecord);
//       resolve(updatedRecord);
//     }
//   }

const addProductToAccount=async(userId,productDetails)=>{
    return new Promise(async(resolve, reject) => {
        let adding=await Account.findOneAndUpdate(
            { userId: userId }, // Search condition
            { $push: { products: productDetails } }, // Update with the new email
            { new: true }
          );
        resolve(adding);

    })
}





module.exports={
    addToAccounts,
    checkExisting,
    getAccountByUserId,
    getAccountProducts,
    getAccountPurchasesAndCredits,
    addProductToAccount
}