const express=require('express')
const mongoose = require('mongoose'); 
const router=express.Router()
const Renew=require('./../db/renew')
const Members=require('./../db/members')
const Membertype=require('./../db/membership_type')
const paginationMiddleware = require('../middleware/pagination');
const {addmembers,getmembers,updatemembers,getmembersbyid,deletemembers}=require('./../handlers/members')
const multer = require('multer');
const path = require('path');
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

router.post("", upload.single('photo'),async(req,res)=>{
    console.log('hai')
   let model=req.body
   if (req.file) {
    model.photo = `images/${req.file.filename}` // Save the filename to the model
   }
   if (typeof model.membership_type === 'string' && model.membership_type.startsWith('{')) {
    try {
        model.membership_type = JSON.parse(model.membership_type); // Parse the object if it's stringified
    } catch (error) {
        return res.status(400).json({ message: 'Invalid membership type format' });
    }
}
   try {
    let membershipTypeId = model.membership_type;
    if (Array.isArray(membershipTypeId)) {
        membershipTypeId = membershipTypeId[0];  // If it's an array, pick the first item
    }

    // Fetch membership type from membertype collection
    const membershipType = await Membertype.findById(membershipTypeId);
    if (!membershipType) {
        return res.status(400).json({ message: 'Invalid membership type' });
    }

    // Get the current date
    const createdAt = new Date();

    // Set expiry date to 1 month before the current date (expired state)
    const expiryDate = new Date();
    expiryDate.setMonth(createdAt.getDate()  - 1); // Subtract 1 month from the current date

    console.log("expiry_date:", expiryDate);

    // Create a new member object
    model.created_at = createdAt;
    model.expiry_date = expiryDate;

    let result = await addmembers(model);
    res.send(result);

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create member', error });
  }
  


})
router.get("",paginationMiddleware(Members),upload.single('photo'),async(req,res)=>{
  if (req.file) {
    model.photo = `images/${req.file.filename}`;
  }
  if (res.pagination) {
    return res.json(res.pagination);  // Sends the response here
  }
let result=await getmembers()
res.send(result)

})
router.get("/:id",async(req,res)=>{
let id=req.params['id']
  let result=await getmembersbyid(id)
  res.send(result)
  })
//   router.put("/:id", upload.single('photo'), async (req, res) => {
   
//     let model = req.body;
//     const memberId = req.params.id; // Get the member ID from the route params
    
//     if (req.file) {
//         model.photo = `images/${req.file.filename}`; // Save the filename to the model if a new photo is uploaded
//     }

//     // Handle membership_type if it's a stringified object
//     if (typeof model.membership_type === 'string' && model.membership_type.startsWith('{')) {
//         try {
//             model.membership_type = JSON.parse(model.membership_type); // Parse the object if it's stringified
//         } catch (error) {
//             return res.status(400).json({ message: 'Invalid membership type format' });
//         }
//     }

//     try {
//         let membershipTypeId = model.membership_type;
//         if (Array.isArray(membershipTypeId)) {
//             membershipTypeId = membershipTypeId[0];  // If it's an array, pick the first item
//         }
//   // Ensure membershipTypeId is a valid ObjectId
  
//   if (!mongoose.Types.ObjectId.isValid(membershipTypeId)) {
//     return res.status(400).json({ message: 'Invalid membership type ID' });
// }
// console.log('Parsed Membership Type ID:', membershipTypeId);
//         // Fetch membership type from membertype collection
//         console.log('Received model:', model);
//         console.log('Parsed membership type:', membershipTypeId);
        
//         const membershipType = await Membertype.findById(membershipTypeId);
//         if (!membershipType) {
//             console.log('No matching membership type found');
//             return res.status(400).json({ message: 'Invalid membership type' });
//         }

//         // Get the current date
//         const createdAt = new Date();

//         // Set expiry date to 1 month before the current date (expired state)
//         const expiryDate = new Date();
//         expiryDate.setMonth(createdAt.getMonth() - 1); // Subtract 1 month from the current date

//         console.log("expiry_date:", expiryDate);

//         // Set the model's dates and other properties
//         model.created_at = createdAt;
//         model.expiry_date = expiryDate;

//         // Update the existing member in the database using their ID
//         let result = await Member.findByIdAndUpdate(memberId, model, { new: true });
        
//         // Check if the member exists
//         if (!result) {
//             return res.status(404).json({ message: 'Member not found' });
//         }

//         res.send(result); // Send the updated member back in the response

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to update member', error });
//     }
// });

router.put("/:id",upload.single('photo'),async(req,res)=>{
  console.log('Update request received with data:', req.body); // Log the request body
  console.log('File uploaded:', req.file);
    let model=req.body
   let id=req.params['id']
   if (req.file) {
    model.photo = `images/${req.file.filename}`;
  }
  try {
    // Ensure membership_type is valid
    let membershipTypeId = model.membership_type;
    if (Array.isArray(membershipTypeId)) {
      membershipTypeId = membershipTypeId[0]; 
    }
  // Parse JSON if membershipTypeId is a JSON string
  if (typeof membershipTypeId === 'string' && membershipTypeId.startsWith('{')) {
    try {
      const parsed = JSON.parse(membershipTypeId);
      membershipTypeId = parsed._id || parsed.id; // Adjust based on your schema
  } catch (error) {
      return res.status(400).json({ message: 'Invalid membership type format' });
  }// Adjust based on your schema
}

console.log ('membershipTypeId Considered : ', membershipTypeId);
// Validate if membershipTypeId is a valid ObjectId
// if (!mongoose.Types.ObjectId.isValid(membershipTypeId)) {
//     return res.status(400).json({ message: 'Invalid membership type ID' });
// }
    const membershipType = await Membertype.findById(membershipTypeId);
    if (!membershipType) {
        return res.status(400).json({ message: 'Invalid membership type' });
    }
    model.membership_type = membershipType._id;
    // Proceed with updating the member
    const updatedMember = await updatemembers(id, model);
    res.send({ message: 'Member updated successfully', member: updatedMember });

} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update member', error });
}
//  await updatemembers(id,model)

//  res.send({message:'updated'})
 })

//  router.delete("/:id",async(req,res)=>{

//    let id=req.params['id']
 
//  await deletemembers (id)

//  res.send({message:'deleted'})
//  })
router.delete("/:id", async (req, res) => {
  const memberId = req.params['id'];

  try {
      // Step 3: Call deletemembers to delete both member and renewals
      const result = await deletemembers(memberId);

      // Send success response
      res.status(200).json(result);
  } catch (err) {
      console.error("Error deleting member:", err);
      // Send error response if something went wrong
      res.status(500).json({ message: 'An error occurred while deleting the member and renewals' });
  }
});

module.exports=router