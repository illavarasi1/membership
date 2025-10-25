const Members=require('./../db/members')
const Membertype=require('./../db/membership_type')
const Renew=require('./../db/renew')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/user');
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Request Body:', req.body); 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }
  
    try {
      console.log('Finding user with email:', email);
const user = await User.findOne({ email });
console.log('Fetched User:', user);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password!" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password Match:', isMatch);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password!" });
      }
  
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
  
  module.exports = { login };
  