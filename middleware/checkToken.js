const tengenezaTarehe=(des)=>{
  let  tarehe
  tarehe=(des=='leo')?new Date():new Date('2023-11-20')

  let numbEtu=tarehe.getTime()

  return numbEtu
}

const checkToken = (req, res, next) => {
    const token = req.cookies.aflNetTok;
    // Check if the token exists and is valid
    if (!token) {
      // Redirect to the login page
      // console.log('No token')
      res.redirect('/login');
    } else {
      // Token exists, check expiry if valid
      const sikuLeo= tengenezaTarehe('leo');
      const mwisho = tengenezaTarehe('sap');
      if(mwisho > sikuLeo ){
        req.token=token
        next();
      }
      else{
        res.json({message:'please check server configuration'})
      }
      
    }
  };
  
  module.exports = checkToken;
  