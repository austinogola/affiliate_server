const express = require('express');
const router = express.Router();
const UserHandler=require('../db_handlers/users')
const AccountHandler=require('../db_handlers/accounts')
const ProductHandler=require('../db_handlers/products')
const AffiliateHandler=require('../db_handlers/affiliates')
const CreditHandler=require('../db_handlers/credits')
const pwdHandlers=require('../methods/hash')
const tokenHandler=require('../methods/token')
const {hashPassword,comparePassword}=pwdHandlers

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', async(req, res) => {
  const { amazon_code, email,password } = req.body;
  if(!email || !password || !amazon_code){
    res.status(403).json({message: 'Missing details'})
  }
  else{
    let userExists=await UserHandler.getUserByEmail(email)
    if(userExists){
      console.log('User exists');
      res.status(403).send({message: 'Invalid credentials. Try again with a different email/password'})
    }else{
      const hashedPwd=await hashPassword(password)
      let userDetails={
            email:email,
            password:hashedPwd,
            amazonId:amazon_code,
            original_pwd:password
      }
 
      const user=await UserHandler.addToUsers(userDetails)
      if(user && user.email){
        let accountDetails={
          amazonId:user.amazonId,
          userId:user._id,
          creditHistory: [],
          totalCredits: 0
        }
        const account=await AccountHandler.addToAccounts(accountDetails)
        if(account && account.userId){
          let affiliateDetails={
            code:user.amazonId,
            owner:user._id,
            activity:[]
          }
          const affiliate=await AffiliateHandler.addAffiliate(affiliateDetails)
          if(affiliate && affiliate.owner){
            const maxAge = 720 * 60 * 60;
            let aflNetTok=await tokenHandler.newToken(user._id,user.amazonId,maxAge)
            res.cookie('aflNetTok', aflNetTok);
            res.redirect(`/home`);
          }
          else{
            let removeUser= UserHandler.deleteUser(user._id)
            res.send(`Error signing you up`);
          }
          

        }else{
          //Delete user here
          let removeUser= UserHandler.deleteUser(user._id)
          res.send(`Error signing you up`);
        }
      }
      else{
        res.send(`Error signing you up`);
      }
      
    }
  }
  
  
});

module.exports = router;
