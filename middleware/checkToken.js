
const checkToken = (req, res, next) => {
    const token = req.cookies.aflNetTok;
    // Check if the token exists
    if (!token) {
      // Redirect to the login page
      // console.log('No token')
      res.redirect('/login');
    } else {
      // Token exists, proceed to the next middleware/route
      req.token=token
      next();
    }
  };
  
  module.exports = checkToken;
  