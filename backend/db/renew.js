const mongoose=require('mongoose')
const renewSchema=new mongoose.Schema({
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'member' },
  //   membership_type: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'membertype'  // Refers to the 'Membertype' model
  // },
    total_amount:Number,
    renew_date: {
      type: Date,
      default: Date.now,
      }
})
// Make sure to delete renewals when a member is deleted
renewSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
      await Renew.deleteMany({ member_id: this.member_id });
      next();
  } catch (error) {
      next(error);
  }
});
const Renew=mongoose.model('renew',renewSchema)
module.exports=Renew