const express = require('express');
const { login } = require('../handlers/auth');
const router = express.Router();
const Renew=require('./../db/renew')
const Members=require('./../db/members')
const Membertype=require('./../db/membership_type')
const Setting=require('./../db/settings')
const User = require('../db/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const authenticateToken = require('../middleware/authenticate'); 
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = "your_secret_key";
// // Middleware to verify JWT token
// function authenticateToken(req, res, next) {
//     const token = req.header('Authorization');
  
//     if (!token) return res.status(403).json({ message: 'Access Denied' });
  
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.user = decoded; // Attach user data to request
//       next();
//     } catch (err) {
//       res.status(401).json({ message: 'Invalid token' });
//     }
//   }
// const { login } = require('../handlers/auth');
// router.post("/register",async(req,res)=>{
//     const model= req.body;
   
//  // Pass req.body directly to login
//  try {
//     const result = await login(req, res);  // Use the req and res objects in login
//     res.send(result); // Send the result back to the client
// } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error });
// }
//  })
router.post('/register', async (req, res) => {
    // try {
      const { email, password } = req.body;
         // Validate input
    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required' });
    }

      try {
        console.log('Received email:', email); // Debugging
        console.log('Received password:', password); // Debugging
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already in use' });
        }

         // Create a new user
         const user = new User({ email, password });

         // Save the user to the database
         await user.save();
        // Generate a JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send({ message: 'User registered successfully!', token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ message: 'Error registering user', error });
    }
    //   // Validate input
    //   if (!email || !password) {
    //     return res.status(400).json({ message: 'All fields are required' });
    //   }
  
    //   // Check if user already exists
    //   const existingUser = await User.findOne({ email });
    //   if (existingUser) {
    //     return res.status(400).json({ message: 'Email already exists' });
    //   }
  
    //   // Create a new user
    //   const newUser = new User({ email, password });
    //   await newUser.save();
  
    //   res.status(201).json({ message: 'User registered successfully' });
    // } catch (error) {
    //   res.status(500).json({ message: 'Server error' });
    // }
  });
  // Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Save the token to the user document
        user.token = token;
        await user.save();

        return res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred during login.' });
    }
});
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: "Email and password are required!" });
//     }

//     try {
//         console.log("Login request payload:", req.body);
//         const existingUser = await User.findOne({ email });
//         console.log("User Query Result:", existingUser);
//         if (!existingUser) {
//             console.log("No user found with email:", email);
//             return res.status(400).json({ message: "User does not exist!" });
//         }
//         console.log("Stored hashed password:", existingUser.password);
//         const isMatch = await bcrypt.compare(password, existingUser.password);
//         console.log("Password match status:", isMatch);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }
//            // Create a new user instance
// //            const newUser = new User({
// //             email,
// //             password // This will be hashed in the 'pre' middleware of the User model
// //         });
// //   // Save the new user to the database
// //   const savedUser = await newUser.save();

// // 
//           // Compare the passwords
// //   const passwordMatch = await bcrypt.compare(password, existingUser.password);
  
// //   if (!passwordMatch) {
// //     return res.status(401).json({ message: "Invalid email or password" });
// //   }

//         // Generate a JWT token (for authentication purposes)
//         const token = jwt.sign(
//             { userId: existingUser._id, email: existingUser.email },
//             JWT_SECRET, // Use your secret key (preferably stored in an environment variable)
//             { expiresIn: '2d' }
//         );
//          console.log("Generated token:", token);
//         // res.json({ token });
//         // savedUser.token = token;
//         // await savedUser.save();
//     //     // Respond with the token and a success message
//         res.status(200).json({
//             message: 'Login successful',
//             token,
//             user: {email: existingUser.email }
//         });
//         console.log({token})
//     } catch (error) {
//         console.error("Error in registration:", error);
//         res.status(500).json({ message: "Internal Server Error", error });
//     }

// });

// router.post('/login', login);

module.exports = router;
