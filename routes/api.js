const express = require('express');
const router = express.Router();
const checkToken=require('../middleware/checkToken')
const dataProvider=require('../methods/dataProvider')
const AccountHandler=require('../db_handlers/accounts')
const ProductHandler=require('../db_handlers/products')
const AffiliateHandler=require('../db_handlers/affiliates')
const CreditHandler=require('../db_handlers/credits')
const tokenHandler=require('../methods/token')

router.get('/getWinner', checkToken,async(req, res) => {
	const tokenDetails=await tokenHandler.verifyToken(req.token)
	if(tokenDetails){
		const userAmazonId=tokenDetails.amazonId
	    let affResult=await AffiliateHandler.getToShow(userAmazonId)
	    res.status(200).json(affResult)
	}
	
    // res.render('home',{profileData:profileData});
});

router.post('/transact', checkToken,async(req, res) => {
	const tokenDetails=await tokenHandler.verifyToken(req.token)
	if(tokenDetails){
		let creditInfo={...req.body}
		const addCredit=await CreditHandler.addCredit(creditInfo)
		if(addCredit && addCredit._id){
			res.status(200).json({message:'GOOD'})
		}
		else{
			res.status(200).json({message:'BAD'})
		}
	}
	else{
		res.status(200).json({message:'BAD'})
	}
	
    // res.render('home',{profileData:profileData});
});





module.exports = router;