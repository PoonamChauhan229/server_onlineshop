const jwt=require('jsonwebtoken')
const User=require('../models/userModel')

// const auth = async (req, res, next) => {
//     try {
//       const token = req.header('Authorization').replace('Bearer ', '')
//       //console.log(token);
//       //console.log("auth running");
//       // You can now verify the token and proceed with authentication logic
//       const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
//       //console.log(decoded)
    
//     //   
//     const user =await User.findById(decoded._id)
//     req.user=user
//     req.token=token
//     // console.log(user)
//     console.log(req.get('host') + req.originalUrl);

//     next();
//     } catch (e) {
//       console.log(e,"error, Please Authenticate");
//       // Handle any errors that occur

//     }
    
//   };
  
//   module.exports = auth;


const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send('Unauthorized');
        }

        const token = authHeader.replace('Bearer ', '');

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
        const user = await User.findById(decoded._id);
        req.user = user;
        req.token = token;

        console.log(req.get('host') + req.originalUrl);

        next();
    } catch (e) {
        console.log(e, "error, Please Authenticate");
        res.status(401).send('Unauthorized');
    }
};

module.exports = auth;

  