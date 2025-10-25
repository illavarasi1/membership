const express=require('express')
const router=express.Router()
const Renew=require('./../db/renew')
const Members=require('./../db/members')
const Membertype=require('./../db/membership_type')
const {addrenew,updaterenew,deleterenew,getrenew, getrenewbyid}=require('./../handlers/renew')
router.post("",async(req,res)=>{
  try {
    const model = req.body;  // Get the renewal data from the request body
    const result = await addrenew(model);  // Call the handler to add renewal
    res.send(result);  // Send the result back to the client
} catch (err) {
    res.status(500).send({ message: "Error adding renewal" });
}
 })
 router.get("",async(req,res)=>{

  try {
    const result = await getrenew();  // Call the handler to get all renewals
    res.send(result);  // Send the result back to the client
} catch (err) {
    res.status(500).send({ message: "Error fetching renewals" });
}

    })
    router.get("/:id",async(req,res)=>{
      try {
        const id = req.params['id'];  // Get the ID from the route parameter
        const result = await getrenewbyid(id);  // Call the handler to get renewal by ID
        res.send(result);  // Send the result back to the client
    } catch (err) {
        res.status(500).send({ message: "Error fetching renewal by ID" });
    }
          })
          router.put("/:id",async(req,res)=>{
            try {
              const id = req.params['id'];  // Get the ID from the route parameter
              const model = req.body;  // Get the updated data from the request body
              const result = await updaterenew(id, model);  // Call the handler to update the renewal
              res.send({ message: "Renewal updated successfully", result });  // Send the result back
          } catch (err) {
              res.status(500).send({ message: "Error updating renewal" });
          }
         })
         router.delete('/member/:memberId', async (req, res) => {
          const { memberId } = req.params;  // Get the memberId from the route parameters
      
          try {
              const result = await deleterenew(memberId);  // Call the deleterenew function with memberId
              res.status(200).json(result);  // Return the success message
          } catch (err) {
              console.error("Error deleting renewals:", err);
              res.status(500).json({ message: "An error occurred while deleting the renewals" });
          }
      });

    module.exports=router