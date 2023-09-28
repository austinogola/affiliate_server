const Credit=require('../model/credit')
const User=require('../model/user')
const UserHandler=require('../db_handlers/users')
const AccountHandler=require('../db_handlers/accounts')
const AffiliateHandler=require('../db_handlers/affiliates')

const addCredit=async(creditInfo)=>{
    return new Promise(async(resolve, reject) => {
        if(!creditInfo){
            resolve(false)
            return
        }
        try {
            const stamp=new Date(creditInfo.stamp).getTime();
            let creditOwner=await UserHandler.getUserByAmazon(creditInfo.userCode)
            creditOwner=creditOwner._id
            const benefactorCode=creditInfo.benefactorCode
            let benefactor=await UserHandler.getUserByAmazon(benefactorCode)
            benefactor=benefactor._id
            const product={
                name:creditInfo.product.name,
                price:creditInfo.product.price,
                currency:creditInfo.product.currency,
            }
            const value=(product.price/10).toFixed(2)
            const creditDetails={stamp,creditOwner,benefactor,benefactorCode,product,value}
            let acc=new Credit(creditDetails)
            acc.save().then(async credit=>{
                const addToAccount=await AccountHandler.addAccountCredits(credit,creditOwner)
                const updateAffiliateUse=await AffiliateHandler.updateAffiliateUse(credit)
                resolve(credit)
            })
            
        } catch (error) {
            console.log(error.message)
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

const getCredit=async(id)=>{
    return new Promise(async(resolve, reject) => {
        const credit=await Credit.findOne({_id:id})
        if(credit) {
            resolve(credit)
        }
        else{
            resolve(false)
        }
    })
}

const getCreditsByOwner=async(creditOwner)=>{
    return new Promise(async(resolve, reject) => {
        const credit=await Credit.find({creditOwner}).sort({ stamp: -1 })
        if(credit) {
            resolve(credit)
        }
        else{
            resolve(false)
        }
    })
}



module.exports={addCredit,checkExisting,getCredit,getCreditsByOwner}