const Affiliate=require('../model/affiliate')

const getAffiliateHistory=( code)=>{
    return new Promise(async(resolve, reject)=>{
        if(! code){
            resolve(false)
        }
        else{
            let aff=await  Affiliate.find( {code})
            resolve(aff)
        }
    })
}
const addAffiliate=async(affiliateDetails)=>{
    return new Promise(async(resolve, reject) => {
        if(!affiliateDetails){
            resolve(false)
        }
        else{
            try {
                let aff=new Affiliate(affiliateDetails)
                aff.save().then(async affiliate=>{
                    resolve(affiliate)
                })
                
            } catch (error) {
                resolve(error.message)
            }
        }
        
        
    })
    
}
const updateAffiliateUse=async(creditInfo)=>{
    return new Promise(async(resolve, reject) => {
        if(!creditInfo){
            resolve(false)
        }
        else{
            try {
                const newLast=new Date(creditInfo.stamp)
                let changeLastUsed=await Affiliate.findOneAndUpdate(
                    {owner:creditInfo.benefactor},
                    {lastUsed: newLast },
                    { new: true }
                );

                let addingToActivity=await Affiliate.findOneAndUpdate(
                    { owner:creditInfo.benefactor},
                    { $push: { activity: creditInfo._id } },
                    { new: true }
                );
                
                
            } catch (error) {
                console.log(error.message)
                resolve(error.message)
            }
        }
        
        
    })
}


const getToShow=async(amazonId)=>{
    return new Promise(async(resolve, reject) => {
            const allAffs=await Affiliate.find()
            let winner=await determineWinner(allAffs,amazonId)
            resolve({winner:winner.code,you:amazonId})
        })
    
}

const determineWinner=async(arr,amazonId)=>{

    arr=arr.filter(item=>item.code!=amazonId)
    return new Promise(async(resolve, reject) => {

        arr.forEach(item=>{
            if(!item.lastUsed || item.lastUsed===null){
                resolve(item)
                return
            }
        })
        resolve(arr[0])
    })
}

const getUserAffiliates=async(userId)=>{
    return new Promise(async(resolve, reject) => {
        if(userId) {
            const allAffs=await Affiliate.find()
            resolve(allAffs)
        }
        else{
            resolve(false)
        }
        
    })
}

module.exports={addAffiliate,getToShow,updateAffiliateUse,getUserAffiliates,getAffiliateHistory}