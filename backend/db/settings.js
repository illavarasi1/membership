const mongoose=require('mongoose')
const settingSchema=new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'users',
  //   required: true,
  //   unique: true, // Ensure one settings document per user
  // },
  // userId: {
  //   type: Number,
  //   default: 1, // Set default _id to 1
  //   required: true
  // },
  _id: {
    type: Number, // Change _id type to Number
    default: 1,   // Set default _id as 1
  },
  system_name: {
    type: String,
    required: true,
  },
  currency: {
    type: Number,
    required: true,
  },
  logo: {
    type: String, // Store the file path as a string
    required: false,
  },
});
const Setting=mongoose.model('setting',settingSchema)
module.exports=Setting