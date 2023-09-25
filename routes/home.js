const express = require('express');
const router = express.Router();
const checkToken=require('../middleware/checkToken')

router.get('/', checkToken,(req, res) => {
    res.render('home');
  });

module.exports = router;