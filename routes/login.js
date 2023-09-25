const express = require('express');
const router = express.Router();
const UserHandler=require('../db_handlers/users')
const AccountHandler=require('../db_handlers/accounts')
const pwdHandlers=require('../methods/hash')
const tokenHandler=require('../methods/token')
const {hashPassword,comparePassword}=pwdHandlers

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async(req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    res.status(403).json({message: 'Missing details'})
  }
  else{
    let userExists=await UserHandler.getUserByEmail(email)
    if(!userExists){
      console.log('No user');
      res.status(403).send({message: 'No user with these credentials'})
    }else{
      const passwordValid=await comparePassword(password, userExists.password)
      if(passwordValid){
        let userId=userExists._id
        let account=await AccountHandler.getAccountByUserId(userId)
        let accountId=account._id
        const maxAge = 720 * 60 * 60;
        let aflNetTok=await tokenHandler.newToken(userId,accountId,maxAge)
        // res.status(200).json({success:true,token:aflNetTok})
        // res.redirect(`/home?token=${aflNetTok}`);
        // res.cookie('ghostToken', ghostToken, { httpOnly: true, maxAge }); // St
          res.cookie('aflNetTok', aflNetTok);
          res.redirect(`/home`);
      }
      else{
          res.status(403).json({message: 'Email or password is wrong'})
      }  
      
    }
  }
});

module.exports = router;
