import jwt, { decode } from 'jsonwebtoken'
import dotenv from 'dotenv';


dotenv.config();
//Function for verifying token that is a middleware
 export const verifyToken = (requiredRole) => (req, res, next) => {//requiredrole is paased as argument at the middlware call
  const token = req.headers.authorization?.split(' ')[1];

  console.log(token)
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  console.log(token)
  console.log( process.env.JWT_SECRET)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log(decoded)
    if (err) {
        console.log("error",err)
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    // Check if the user's role matches the required role
    if (decoded.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Store user information in the request object
    req.user = decoded;
    next();
  });
};

