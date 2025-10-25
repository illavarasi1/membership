const mongoose=require('mongoose')
const membertypeSchema=new mongoose.Schema({
    // memberid:Number,
    type: String,
    amount:Number
})
const Membertype=mongoose.model('membertype',membertypeSchema)
module.exports=Membertype