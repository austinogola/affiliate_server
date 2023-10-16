const bcrypt = require('bcrypt');
const tokenHandler=require('./token')
const UserHandler=require('../db_handlers/users')
const AccountHandler=require('../db_handlers/accounts')
const CreditHandler=require('../db_handlers/credits')
const AffiliateHandler=require('../db_handlers/affiliates')

function getCurrentMonthEpoch() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: startOfMonth.getTime(),  // Start of month in epoch with milliseconds
    end: endOfMonth.getTime() + 86400000 - 1  // End of day in epoch with milliseconds
  };
}

function generateDataForCurrentMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const lastDay = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
  
    const data = [];
    for (let i = 1; i <= lastDay; i++) {
      data.push({ x: i, y: i * 10 });
    }
  
    return data;
  }
  function generateDaysForCurrMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const lastDay = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
  
    const data = [];
    for (let i = 1; i <= lastDay; i++) {
      data.push({ x: i,y:0,value:0});
    }
  
    return data;
  }

  function getMonthName(monthNumber) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if (monthNumber >= 0 && monthNumber < monthNames.length) {
    return monthNames[monthNumber];
  } else {
    return 'Invalid Month';
  }
  }

  function splitArrays(arr) {
    const freqs = [];
    const values = [];
  
    for (const item of arr) {
      const { x, y, value } = item;
      freqs.push({ x, y });
      values.push({ x, y: value });
    }
  
    return { freqs, values };
  }
  function findMaxFreq(arr) {
    if (arr.length === 0) return null;
  
    let maxY = arr[0].y;
  
    for (const item of arr) {
      if (item.y > maxY) {
        maxY = item.y;
      }
    }
  
    return maxY;
  }
  function findMaxVal(arr) {
    if (arr.length === 0) return null;
  
    let maxY = arr[0].y;
  
    for (const item of arr) {
      if (item.y > maxY) {
        maxY = item.y;
      }
    }
  
    return maxY;
  }

  const getProfileGraphData=(token)=>{
    return new Promise(async(resolve, reject) => {
        let tokenDetails=await tokenHandler.verifyToken(token)
        let userId=tokenDetails.userId
        const codeActivity = await CreditHandler.getCreditsByBenefactor(userId)
        const { start, end } = getCurrentMonthEpoch();
        const codeActivityThisMonth = codeActivity.filter(obj => obj.stamp >= start && obj.stamp <= end);
        const spendObjsArr=generateDaysForCurrMonth()
        
        codeActivityThisMonth.forEach(item=>{
            const day=(new Date(item.stamp).getDate())
            let objItem=spendObjsArr.filter(item=>item.x==day)[0]
            // let indexOfItem=objItem
            objItem.y+=1
            objItem.value+=Math.round((item.value*10))


            // console.log()
        })
        const todayNum=new Date().getDate()
        const relevantspendObjsArr=spendObjsArr.filter(item=>item.x<=todayNum+1)
        let tt=splitArrays(relevantspendObjsArr)
        let timeObj={
            month:getMonthName(new Date().getMonth()),
            year:new Date().getFullYear(),
            dateNum:todayNum+1

        }
        // console.log(spendObjsArry);
        const code = {
            period:{...timeObj},
            points:tt,
            meta:{
                maxFreq:findMaxFreq(tt.freqs),
                maxVal:findMaxVal(tt.values),
            }
        };
        const spend = {
            period:{...timeObj},
            points:generateDataForCurrentMonth(),
            
        };
    
        resolve({code,spend})
    })
  }
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
        const { start, end } = getCurrentMonthEpoch();
        
        const thisMonthCreds = yourCreds.filter(obj => obj.stamp >= start && obj.stamp <= end);


        // const {products}=await getProfileProducts(tokenDetails.userId)
        // const {purchases,credits}=await getProfilePurchasesAndCredits(tokenDetails.userId)
        // resolve({ email,amazonId,products,credits,purchases,userId})
        // const affiliates= await AffiliateHandler.getAffiliateHistory(userId)
        const codeActivity = await CreditHandler.getCreditsByBenefactor(userId)
        // let activity=affiliates[0].activity
        // console.log(codeActivity);
        
        const codeActivityThisMonth = codeActivity.filter(obj => obj.stamp >= start && obj.stamp <= end);
        // codeActivityThisMonth.forEach(activity=>{
        //     console.log(new Date(activity.stamp).getDay());
        // })
        const dataForCurrentMonth = generateDataForCurrentMonth();
// console.log(dataForCurrentMonth);
        // console.log(codeActivityThisMonth.length, codeActivity.length)
        resolve({ email,amazonId,userId,totalCredits,
            yourCreds,thisMonthCreds,codeActivity,codeActivityThisMonth,dataForCurrentMonth})

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

module.exports={getProfileData,getProfileGraphData}