const express=require('express')
const router=express.Router()
const Membertype=require('./../db/membership_type')
const paginationMiddleware = require('../middleware/pagination');
const {addmembertype,updatemembertype,deletemembertype,getmembertype, getmembertypebyid}=require('./../handlers/membership_type')
router.post("",async(req,res)=>{
   let model=req.body
  
let result=await addmembertype(model)
res.send(result)
})
router.get("",paginationMiddleware(Membertype),async(req,res)=>{
  if (res.pagination) {
    return res.json(res.pagination);  // Sends the response here
  }
let result=await getmembertype()
res.send(result)
// res.json(res.pagination); 
})
router.get("/:id",async(req,res)=>{
let id=req.params['id']
  let result=await getmembertypebyid(id)
  res.send(result)
  })
router.put("/:id",async(req,res)=>{
    let model=req.body
   let id=req.params['id']
 
 await updatemembertype(id,model)

 res.send({message:'updated'})
 })

 router.delete("/:id",async(req,res)=>{

   let id=req.params['id']
 
 await deletemembertype (id)

 res.send({message:'deleted'})
 })
module.exports=router