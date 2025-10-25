const Members=require('./../db/members')
const mongoose = require('mongoose');
const Membertype=require('./../db/membership_type')
const Renew=require('./../db/renew')
function generateMembershipNumber() {
    // Generates a random number and pads it to six digits
    return 'CA-' + String(Math.floor(1 + Math.random() * 999999)).padStart(6, '0');
}
async function addmembers(model){
    const membershipNumber = generateMembershipNumber();
     // Ensure that model.membership_type is a string or ObjectId, not an array
     let membershipTypeId = model.membership_type;
     if (Array.isArray(membershipTypeId)) {
         membershipTypeId = membershipTypeId[0]; // Pick the first element if it's an array
     }
 
     // Find the membership type by _id (use model.membership_type)
     const membershipType = await Membertype.findById(membershipTypeId);
 
     if (!membershipType) {
         throw new Error("Invalid membership type");
     }
let members=new Members({
    fullname:model.fullname,
    dob:model.dob,
    gender:model.gender,
    contact_number:model.contact_number,
    email:model.email,
    address:model.address,
    country:model.country,
    postcode:model.postcode,
    occupation:model.occupation,
    membership_type: membershipType._id, 
    membership_number:membershipNumber,
    created_at: model.created_at,
      photo:model.photo,
            expiry_date: model.expiry_date,
})
await members.save()
return members.toObject()
}
// async function updatemembers(id, model) {
//     try {
//         // Fetch existing member using the provided ID
//         const updatedMember = await Members.findById(id).populate('membership_type');
        
//         if (!updatedMember) {
//             throw new Error("Member not found");
//         }

//         // Update each field from the model, if provided
//         updatedMember.fullname = model.fullname || updatedMember.fullname;
//         updatedMember.dob = model.dob || updatedMember.dob;
//         updatedMember.gender = model.gender || updatedMember.gender;
//         updatedMember.contact_number = model.contact_number || updatedMember.contact_number;
//         updatedMember.email = model.email || updatedMember.email;
//         updatedMember.address = model.address || updatedMember.address;
//         updatedMember.country = model.country || updatedMember.country;
//         updatedMember.postcode = model.postcode || updatedMember.postcode;
//         updatedMember.occupation = model.occupation || updatedMember.occupation;
//         updatedMember.membership_type = model.membership_type || updatedMember.membership_type;
//         updatedMember.membership_number = model.membership_number || updatedMember.membership_number;
//         updatedMember.created_at = model.created_at || updatedMember.created_at;  // You might want to handle this carefully since it's typically set when the member is created
//         updatedMember.photo = model.photo || updatedMember.photo;
//         updatedMember.expiry_date = model.expiry_date || updatedMember.expiry_date;

//         // Save the updated member data to the database
//         await updatedMember.save();

//         return updatedMember.toObject();  // Return the updated member as an object
//     } catch (error) {
//         console.error("Error updating member:", error);
//         throw new Error("Failed to update member");
//     }
// }
async function updatemembers(id, model) {
    try {
        const updatedMember = await Members.findOneAndUpdate({ _id: id }, model, { new: true });
        if (!updatedMember) {
            throw new Error("Member not found");
        }
        return updatedMember.toObject();  // Return updated member object
    } catch (error) {
        console.error("Error updating member:", error);
        throw new Error("Failed to update member");
    }
}
    async function getmembers(){
        let members = await Members.find().populate('membership_type', 'type amount') 
     
          .exec(); 
        return members.map(member => member.toObject());
        }
        async function getmembersbyid(id) {
            try {
                const member = await Members.findById(id).populate('membership_type', 'type amount')  .exec(); 
                if (!member) {
                    throw new Error("Member not found");
                }
                return member.toObject();
            } catch (error) {
                console.error("Error fetching member by ID:", error);
                throw new Error("Failed to fetch member");
            }
        }
    // async function deletemembers(id){
    //     await Members.findByIdAndDelete(id)
    //     return
    //     }

    async function deletemembers(memberId) {
        try {
            console.log("Trying to delete member with ID:", memberId);
    
            // Ensure the memberId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(memberId)) {
                throw new Error('Invalid member ID');
            }
    
            // Check if the member exists before deleting
            const member = await Members.findById(memberId);
    
            // Log the result to verify
            console.log("Member found:", member);
    
            if (!member) {
                throw new Error('Member not found');
            }
    
            // Delete associated renewals before deleting the member
            await Renew.deleteMany({ member_id: memberId });  // Delete renewals related to this member
    
            // Delete the member
            await Members.findByIdAndDelete(memberId);  // Use findByIdAndDelete() to delete the member
    
            return { message: 'Member and associated renewals deleted successfully' };
        } catch (err) {
            console.error("Error deleting member and associated renewals:", err);
            throw err;  // Rethrow the error for proper handling in the route
        }
    }
module.exports={
    addmembers,
    updatemembers,
    deletemembers,
    getmembers,
    getmembersbyid
}