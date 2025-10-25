const Setting = require('./../db/settings');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('./../db/user'); 
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate');
const JWT_SECRET = "your_secret_key";
// Validation schemas
const settingsSchema = Joi.object({
  system_name: Joi.string().required(),
  currency: Joi.string().required(),
});

const passwordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

// Fetch system settings
const getSettings = async (req, res) => {
  try {
    return await Setting.find(); // Return settings from the database
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error; // Propagate the error to the caller
  }
};
// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Directory to store uploaded logos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Handler to post or update settings
const postOrUpdateSettings = async (req, res) => {
  try {
    const { system_name, currency } = req.body;
    const userId = req.user.id; // Assuming user ID is available in `req.user`

    // Check if the user already has settings
    let setting = await Setting.findOne({ userId });

    const logoPath = req.file ? `/images/${req.file.filename}` : null; // Save logo path if file is uploaded

    if (setting) {
      // Update settings if they exist
      setting.system_name = system_name || setting.system_name;
      setting.currency = currency || setting.currency;
      if (logoPath) setting.logo = logoPath; // Update logo only if a new file is uploaded
      await setting.save();
      res.json({ message: 'Settings updated successfully', setting });
    } else {
      // Create new settings if they don't exist
      setting = new Setting({
        userId,
        system_name,
        currency,
        logo: logoPath, // Save logo if provided
      });
      await setting.save();
      res.json({ message: 'Settings created successfully', setting });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to post or update settings', error });
  }
};
// Fetch settings by userId
/**
 * Fetch settings by userId.
 * @param {String} userId - The ObjectId of the user as a string.
 * @returns {Object} - The settings document for the specified user.
 */
const getSettingsByUserId = async (userId) => {
  try {
    const setting = await Setting.findOne({ userId }).populate('userId'); // Populate userId if needed
    if (!setting) {
      throw new Error('Settings not found for this user');
    }
    return setting;
  } catch (error) {
    throw error; // Propagate error to the caller
  }
};
// // Update system settings
// const fs = require('fs');

// // Update or create system settings
// const updateSettings = async (req, res) => {
//   try {
//     const { system_name } = req.body;

//     // If system_name is not provided, return an error
//     if (!system_name) {
//       return res.status(400).json({ message: 'System name is required' });
//     }

//     // Check if a file (logo) was uploaded
//     let logoData = null;
//     if (req.file) {
//       logoData = {
//         data: fs.readFileSync(path.join(__dirname, '..', req.file.path)), // Read the file from the disk
//         contentType: req.file.mimetype, // Get the mime type (e.g., image/png)
//       };
//     }

//     // Check if settings record exists
//     let settings = await Setting.findOne({ id: 1 });

//     if (settings) {
//       // If settings exist, update them with the new system_name and logo
//       settings.system_name = system_name;
//       if (logoData) {
//         settings.logo = logoData;
//       }
//       await settings.save();

//       return res.json({ message: 'Settings updated successfully', settings });
//     } else {
//       // If settings do not exist, create a new record
//       const newSettings = new Setting({
//         id: 1, // Assuming you're using `id: 1` as a constant
//         system_name,
//         logo: logoData,
//         currency: 'USD', // Default currency
//       });

//       await newSettings.save();
//       return res.json({ message: 'Settings created successfully', newSettings });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update or create settings', error });
//   }
// };

// Change user password
const changePassword = async (req, res) => {
  // try {
  //   const { error } = passwordSchema.validate(req.body);
  //   if (error) {
  //     return res.status(400).json({ message: error.details[0].message });
  //   }

  //   const { currentPassword, newPassword } = req.body;
  //   const userId = req.user.id; // Assuming `req.user` is populated from middleware

  //   const user = await User.findById(userId);
  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }

  //   const isMatch = await bcrypt.compare(currentPassword, user.password);
  //   if (!isMatch) {
  //     return res.status(400).json({ message: 'Invalid current password' });
  //   }

  //   user.password = await bcrypt.hash(newPassword, 10);
  //   await user.save();

  //   res.json({ message: 'Password changed successfully' });
  // } catch (error) {
  //   res.status(500).json({ message: 'Failed to change password', error });
  // }
  // const { userId } = req.user.id; 
  // Retrieve the token from headers
  const token = req.headers.authorization?.split(' ')[1] || req.headers['x-access-token'];
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      const userEmail = decoded.email; // Extract email from token

      // Find user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Verify the current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Check if new passwords match
      if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: 'New passwords do not match' });
      }

      // Hash and save the new password
      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSettings,
  postOrUpdateSettings,
  upload,
  getSettingsByUserId,
  // updateSettings,
  changePassword,
};
