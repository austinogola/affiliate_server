const Credit=require('../model/credit')
const User=require('../model/user')

const addCredit=async(creditDetails)=>{
    return new Promise((resolve, reject) => {
        try {
            let acc=new Credit(creditDetails)
            acc.save().then(credit=>{
                resolve(credit)
            })
            
        } catch (error) {
            resolve(error.message)
        }
        
    })
    
}

const checkExisting=async(email)=>{
    return new Promise(async(resolve, reject) => {
        const emailExists=await Credit.findOne({email})
        if(emailExists) {
            resolve(true)
        }
        else{
            resolve(false)
        }
    })
    
}

const getCredits=async(id)=>{
    return new Promise(async(resolve, reject) => {
        const accountOwner=await Credit.findOne({_id:id})
        if(accountOwner) {
            resolve(accountOwner)
        }
        else{
            resolve(false)
        }
    })
}




module.exports={addCredit,checkExisting,getCredits}