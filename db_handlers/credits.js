const Credit=require('../model/credit')
const User=require('../model/user')
const UserHandler=require('../db_handlers/users')
const AccountHandler=require('../db_handlers/accounts')
const AffiliateHandler=require('../db_handlers/affiliates')

function getRandomEpochBetween(start, end) {
    const randomTime = start + Math.random() * (end - start);
    return Math.floor(randomTime);
}
function getRandomProductName() {
    const prefixes = [
        'Charmin Ultra Strong', 'Bounty Select-A-Size', 'Tide Laundry Detergent', 'Colgate Total', 'Golden iPhone 12', 'Pink Samsung Galaxy', 'Sony PlayStation', 'Dyson Vacuum Set'];
    const suffixes = [
        'Toilet Paper', 'Paper Towels', 'Laundry Detergent', 'Toothpaste', 'Phone', 'Television Set', 'Vacuum Cleaner',"Water gun toy","Boomin sound bar"
    ];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${randomPrefix} ${randomSuffix}`;
}

function getRandomPrice() {
    return (Math.random() * (100 - 5) + 5).toFixed(2);
}

function generateRandomProduct() {
    const productName = getRandomProductName();
    const productPrice = getRandomPrice();
    return { name: productName, price: parseFloat(productPrice) };
}

const updatePending=(_id)=>{
    return new Promise(async(resolve, reject)=>{
        if(!_id){
            resolve(false)
        }
        else{
            let updateComplete=await Credit.findOneAndUpdate(
                {_id:_id},
                {complete: true },
                { new: true }
            );
            resolve(updateComplete)
        }
                

    })
}

const getPending=(userId)=>{
    return new Promise(async(resolve, reject) => {
        if(!userId){
            resolve(false)
            return;
        }
        const credits=await Credit.find({creditOwner:userId,complete:false}).sort(
            {stamp:-1})
        if(credits) {
            resolve(credits)
        }
        else{
            resolve(false)
        }

    })
}
const addCredit=async(creditInfo)=>{
    return new Promise(async(resolve, reject) => {
        if(!creditInfo){
            resolve(false)
            return
        }
        const item={}
        const {name,price,benefactorCode,ownerCode,productId}=creditInfo
        item.stamp=creditInfo.timestamp
        item.product={name,price,productId}
        item.product.currency='$'
        item.ownerCode=ownerCode
        item.benefactorCode=benefactorCode
        let creditOwner=await UserHandler.getUserByAmazon(ownerCode)
        item.creditOwner=creditOwner._id
        let benefactor=await UserHandler.getUserByAmazon(benefactorCode)
        item.benefactor=benefactor._id
        item.value = Math.floor(item.product.price*10)/100
        // console.log(item,creditInfo);
        let acc=new Credit(item)
            acc.save().then(async credit=>{
                // console.log(credit);
                resolve(credit)
                // console.log(credit)
                const addToAccount=await AccountHandler.addAccountCredits(credit,credit.creditOwner)
                // console.log(addToAccount)
                const updateAffiliateUse=await AffiliateHandler.updateAffiliateUse(credit)
                // console.log(updateAffiliateUse)
            })
    })
}

const addCredit2=async(creditInfo)=>{
    return new Promise(async(resolve, reject) => {
        if(!creditInfo){
            resolve(false)
            return
        }
        try {
            const today = new Date();  // Current date and time
            const lastJuly = new Date(today.getFullYear(), 9, 10);
            const firstJuly = new Date(today.getFullYear(), 9, 1);


            // const stamper=new Date("2023-10-07T15:13:13.139Z").getTime()
            const item={}
            item.stamp = getRandomEpochBetween(firstJuly.getTime(), lastJuly.getTime());
           console.log(new Date(item.stamp));
            item.product=generateRandomProduct()
            item.product.currency='$'
            item.benefactorCode=creditInfo.benefactorCode
            item.ownerCode=creditInfo.ownerCode

            // const randomDate=new Date(randomEpoch)
            resolve('DONE')
           
            let creditOwner=await UserHandler.getUserByAmazon(item.ownerCode)
            item.creditOwner=creditOwner._id
            const benefactorCode=item.benefactorCode
            let benefactor=await UserHandler.getUserByAmazon(benefactorCode)
            item.benefactor=benefactor._id
            // const stamp=new Date(item.timestamp).getTime();
            // console.log(creditOwner,benefactor);
            item.value = Math.floor(item.product.price*10)/100
           
            // const product={
            //     name:creditInfo.product.name,
            //     price:creditInfo.product.price,
            //     currency:creditInfo.product.currency,
            // }
            return
            // const creditDetails={stamp,creditOwner,benefactor,benefactorCode,product,value}
            let acc=new Credit(item)
            acc.save().then(async credit=>{
                // console.log(credit)
                const addToAccount=await AccountHandler.addAccountCredits(credit,credit.creditOwner)
                // console.log(addToAccount)
                const updateAffiliateUse=await AffiliateHandler.updateAffiliateUse(credit)
                // console.log(updateAffiliateUse)
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

const getCreditsByBenefactor=async(userId)=>{
    return new Promise(async(resolve, reject) => {
        if(!userId) {
            resolve(false)
        }
        else{
            const credits=await Credit.find({benefactor:userId}).sort({ stamp: -1 })
            resolve(credits)
        }
    })
}


module.exports={
    addCredit,checkExisting,
    getCredit,getCreditsByOwner,
    getCreditsByBenefactor,getPending,
    updatePending
}