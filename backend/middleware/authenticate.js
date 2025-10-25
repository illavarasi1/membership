const jwt = require('jsonwebtoken');
const User = require('../db/user');
// require('dotenv').config();

const JWT_SECRET = "your_secret_key";
const authenticateToken = async(req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]|| req.headers['x-access-token'];
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]; 
    // const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret from .env file to verify
//         req.user = decoded; // Attach the decoded data to request object (user info)
//         next(); // Pass control to the next middleware or route handler
//     } catch (error) {
//         return res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };
console.log("Token:", token);
if (!token) return res.status(401).json({ message: 'Access token missing' });

   // Verify the token
   jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
        console.error('JWT Verification Error:', err);
        return res.status(401).json({ message: 'Invalid token signature or expired token.' });
    }

    // If token is valid, attach the decoded data to the request object
    req.user = decoded; // Now, you have access to user data in subsequent routes

    next(); // Pass control to the next middleware or route handler
});
};




module.exports = authenticateToken;
