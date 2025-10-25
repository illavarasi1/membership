const mongoose=require('mongoose')
const bcrypt = require('bcryptjs');
const userSchema=new mongoose.Schema({
    id: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
    registration_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
})
// // Hash password before saving
// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   });
// Hash password before saving
userSchema.pre('save', async function (next) {
    console.log('Password hashing middleware triggered');
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Add a method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User=mongoose.model('users',userSchema)
module.exports=User