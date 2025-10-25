const mongoose=require('mongoose')
const memberSchema=new mongoose.Schema({
    fullname:String,
    dob:Date,
    gender:String,
    contact_number:Number,
    email:String,
    address:String,
    country:String,
    postcode:Number,
    occupation:String,
    membership_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'membertype'  // Refers to the 'Membertype' model
    },
    membership_number:String,
    created_at: {
      type: Date,
      default: Date.now, // Automatically set to the current date
  },
      photo: String, 
      expiry_date: Date
      

})
memberSchema.pre('remove', async function (next) {
    try {
        // Find and delete all renewals associated with the current member
        await Renew.deleteMany({ member_id: this._id });
        console.log(`Deleted renewals for member ${this._id}`);
        next();
    } catch (err) {
        next(err);  // Pass the error to the next middleware
    }
});
const Member=mongoose.model('member',memberSchema)
module.exports=Member