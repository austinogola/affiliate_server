const express = require('express');
const path = require('path');
const router = express.Router();
const checkToken=require('../middleware/checkToken')
const dataProvider=require('../methods/dataProvider')
const AccountHandler=require('../db_handlers/accounts')
const ProductHandler=require('../db_handlers/products')
const tokenHandler=require('../methods/token')

router.get('/', checkToken,async(req, res) => {
    let profileData=await dataProvider.getProfileData(req.token)
    // let newProds=await parseHomeData(profileData.products)
    // console.log(profileData)
    // console.log(profileData.thisMonthCreds);
    res.cookie('graphData', profileData.dataForCurrentMonth);
    res.render('home',{profileData:profileData});
    // res.sendFile(path.join(__dirname, '/public/home.html'));
  });

  router.get('/credits', checkToken,async(req, res) => {
    let profileData=await dataProvider.getProfileData(req.token)
    // let newProds=await parseHomeData(profileData.products)
    // console.log(profileData)
    res.render('home/credits',{profileData:profileData});
  });

  router.get('/affiliate', checkToken,async(req, res) => {
    let profileData=await dataProvider.getProfileData(req.token)
    // let newProds=await parseHomeData(profileData.products)
    // console.log(newProds)
    // console.log(profileData);
    // console.log(profileData);
    res.render('home/affiliate',{profileData:profileData});
  });

  router.post('/code', checkToken,async(req, res) => {
    const {name,normalLink,afLink,userId}=req.body
    if(name && normalLink && afLink && userId){
      let tokenVer=await tokenHandler.verifyToken(req.token)
      if(tokenVer.userId==userId){
        let productDetail={name,normalLink,afLink}
        let added=await ProductHandler.addProduct(userId,productDetail)
      }
    }
    res.redirect('/home/code')
    // res.render('home/products',{profileData:profileData});
  });

  router.get('/signout', checkToken,async(req, res) => {
    // let profileData=await dataProvider.getProfileData(req.token)
    // let newProds=await parseHomeData(profileData.products)
    res.cookie('aflNetTok', '', { expires: new Date(0) });
    // console.log('Removed cookie')
    res.redirect('/home')
    // res.render('home/credits',{profileData:profileData});
  });

  const parseHomeData=(products)=>{
    return new Promise((resolve, reject) => {
      function formatDate(num){
        let options={ year: 'numeric', month: 'long', day: 'numeric' };
        let date=new Date(num).toLocaleDateString('en-US', options)
        return(date)
      }
      
      if(products[0]){
        let newProds = [...products]

        let newProds2=[]
        newProds.forEach(item=>{
          if(item.dateAdded){
            item.dateNew=formatDate(item.dateAdded)
            newProds2.push(item) 
          }
          else{
            newProds2.push(item) 
          }
        })
        console.log(newProds2);
        // console.log(newProfileData.products);
        resolve(products)
      }else{
        resolve(products)
      }
    })
  }

module.exports = router;