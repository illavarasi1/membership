const express = require('express');
const busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Setting = require('./../db/settings');
// const authenticate = require('./auth')
const bcrypt = require('bcryptjs');
const User = require('../db/user');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate'); 
const { getSettings,getSettingsByUserId, changePassword,postOrUpdateSettings } = require('../handlers/settings');
const router = express.Router();
// Set storage location and file naming convention
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Save files in the public/images directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });



// Fetch settings
router.get('/', upload.single('logo'),async (req, res) => {
  try {
    let logoPath;

    if (req.file) {
      logoPath = `images/${req.file.filename}`;
      updateData.logo = logoPath; 
    }
    const settings = await getSettings(); // Assuming getSettings is an async function
    res.status(200).json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings', error });
  }
});
// GET: Fetch settings by user ID
// router.get('/:userId', authenticateToken,upload.single('logo'), async (req, res) => {
//   try {
//     const setting = await Setting.findOne({ userId: req.params.userId });
//     if (!setting) {
//       return res.status(404).send({ error: 'Settings not found' });
//     }
//     res.send(setting);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });
// Get settings by ID
router.get('/:id',upload.single('logo'), async (req, res) => {
  // const id = parseInt(req.params.id); // Parse to Number
  try {
    let logoPath;

    if (req.file) {
      logoPath = `images/${req.file.filename}`;
      updateData.logo = logoPath; 
    }
    const setting = await Setting.findById(req.params.id);
    if (!setting) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving setting', error });
  }
});
// Create or update settings with optional logo
router.post('/settings',upload.single('logo'), async (req, res) => {
  try {
    // console.log(req.file); // Log file upload details
    console.log("hi",req.body);
    const {system_name, currency ,logo} = req.body;
    let logoPath;

    if (req.file) {
      logoPath = `images/${req.file.filename}`;
      updateData.logo = logoPath; 
    }
    const newSetting = new Setting({
      system_name,
      currency,
      logo: logoPath || undefined,
    });

    const savedSetting = await newSetting.save();

    res.status(201).json({ success: true, data: savedSetting });
  } catch (err) {
    console.error('Error creating settings:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.put('/settings', upload.single('logo'), async (req, res) => {
  try {
    const { system_name, currency,logo } = req.body;
    let updateData = { system_name, currency,logo };
    let logoPath;

    // Check if the file was uploaded, and if so, update the logo path
    if (req.file) {
      logoPath = `images/${req.file.filename}`;
      updateData.logo = logoPath; 
    }

    const updatedSetting = await Setting.findOneAndUpdate(
      { _id: 1 }, // Default ID
      updateData, // Data to update
      { new: true, upsert: true } // Return updated doc; create if not exists
    );
    res.status(200).json({ success: true, data: updatedSetting });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// let settings;
// if (req.body.id) {
//   // Update if ID is provided
//   settings = await Setting.findByIdAndUpdate(
//     req.body.id,
//     updateData,
//     { new: true, runValidators: true }
//   );
//   if (!settings) {
//     return res.status(404).json({ success: false, message: 'Setting not found' });
//   }
// } else {
//   // Create a new setting if no ID is provided
//   settings = new Setting(updateData);
//   await settings.save();
// }

// res.status(200).json({ success: true, settings });
// } catch (err) {
// res.status(500).json({ success: false, error: err.message });
// }
// });
// Update settings with PUT request

// // PUT route to update settings
// router.put('/settings/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const updateData = req.body;

//   try {
//     // Find and update the settings document for the specified userId
//     const updatedSetting = await Setting.findOneAndUpdate(
//       { userId }, // Filter condition
//       updateData, // Data to update
//       { new: true, runValidators: true } // Options: return updated doc, validate data
//     );

//     if (!updatedSetting) {
//       return res.status(404).json({ message: 'Settings not found for this user.' });
//     }

//     res.status(200).json({ message: 'Settings updated successfully', data: updatedSetting });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating settings', error: error.message });
//   }
// });

// Change Password Route
router.post('/change-password', authenticateToken, changePassword);
// router.post('/change-password', authenticateToken, async (req, res) => {
//   try {
//       const { currentPassword, newPassword, confirmPassword } = req.body;

//       // Validate input
//       if (!currentPassword || !newPassword || !confirmPassword) {
//           return res.status(400).json({ message: "All fields are required" });
//       }

//       if (newPassword !== confirmPassword) {
//           return res.status(400).json({ message: "New password and confirm password do not match" });
//       }

//       // Find the user from the token payload
//       const userId = req.user.userId; // userId is extracted from JWT token
//       const user = await User.findById(userId);

//       if (!user) {
//           return res.status(404).json({ message: "User not found" });
//       }

//       // Check if the current password matches
//       const isMatch = await bcrypt.compare(currentPassword, user.password);
//       if (!isMatch) {
//           return res.status(400).json({ message: "Current password is incorrect" });
//       }

//       // Hash the new password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(newPassword, salt);

//       // Update the user's password
//       user.password = hashedPassword;
//       await user.save();

//       res.status(200).json({ message: "Password changed successfully" });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error", error });
//   }
// });
module.exports = router;
