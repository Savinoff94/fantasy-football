const jwt = require('jsonwebtoken');
const secret = 'mysecretshhhhh';

const withAuth = (req, res, next) => {
  const token =  req.body.token 

  console.log('req.body.token',req.body.token);
  if(!token) {
    res.status(401).send('Unauthorized: No Token provided')
  }
  else{
    jwt.verify(token, secret, function(err,decoded){
      if(err){
        res.status(401).send('Unauthorized: Invalid token')
      }
      else {
        console.log(decoded.email);
        next();
      }
    })
  }
}
module.exports = {
  withAuth
}
