onst express = require('express');
const router = express.Router();
const checkToken=require('../middleware/checkToken')
const dataProvider=require('../methods/dataProvider')
const AccountHandler=require('../db_handlers/accounts')
const ProductHandler=require('../db_handlers/products')
const tokenHandler=require('../methods/token')

router.get('/', checkToken,async(req, res) => {
    let {link}=req.query
    let linkResult=await ProductHandler.checkProductLink(link)
    res.status(200).json(linkResult)
    // res.render('home',{profileData:profileData});
});





module.exports = router;