const express = require('express');
const router = express.Router();
const checkToken=require('../middleware/checkToken')
const dataProvider=require('../methods/dataProvider')
const AccountHandler=require('../db_handlers/accounts')
const ProductHandler=require('../db_handlers/products')
const tokenHandler=require('../methods/token')

router.get('/', checkToken,async(req, res) => {
    let profileData=await dataProvider.getProfileData(req.token)
    profileData=await parseHomeData(profileData)
    res.render('home',{profileData:profileData});
  });

  router.get('/credits', checkToken,async(req, res) => {
    let profileData=await dataProvider.getProfileData(req.token)
    profileData=await parseHomeData(profileData)
    res.render('home/credits',{profileData:profileData});
  });

  router.get('/products', checkToken,async(req, res) => {
    let profileData=await dataProvider.getProfileData(req.token)
    profileData=await parseHomeData(profileData)
    console.log(profileData);
    // console.log(profileData);
    res.render('home/products',{profileData:profileData});
  });

  router.post('/products', checkToken,async(req, res) => {
    const {name,normalLink,afLink,userId}=req.body
    if(name && normalLink && afLink && userId){
      let tokenVer=await tokenHandler.verifyToken(req.token)
      if(tokenVer.userId==userId){
        let productDetail={name,normalLink,afLink}
        let added=await ProductHandler.addProduct(userId,productDetail)
      }
    }
    res.redirect('/home/products')
    // res.render('home/products',{profileData:profileData});
  });

  const parseHomeData=(profileData)=>{
    return new Promise((resolve, reject) => {
      function formatDate(num){
        let options={ year: 'numeric', month: 'long', day: 'numeric' };
        let date=new Date(num).toLocaleDateString('en-US', options)
        console.log(date);
        return(date)
      }
      let products=profileData.products
      if(products[0]){
        products.forEach(item=>{
          let dateNow=formatDate(item.dateAdded)
          item.dateNow=dateNow
        })
        profileData.products=products
        console.log(profileData.products);
        resolve(profileData)
      }else{
        resolve(profileData)
      }
    })
  }

module.exports = router;