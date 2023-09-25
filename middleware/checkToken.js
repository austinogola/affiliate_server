
const checkToken = (req, res, next) => {
    const token = req.cookies.aflNetTok;
    // Check if the token exists
    if (!token) {
      // Redirect to the login page
      res.redirect('/login');
    } else {
      // Token exists, proceed to the next middleware/route
      next();
    }
  };
  
  module.exports = checkToken;
  