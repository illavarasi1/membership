const Membertype=require('./../db/membership_type')

async function addmembertype(model){
let memberstype=new Membertype({
    memberid:model.memberid,
    type: model.type,
    amount: model.amount
})
await memberstype.save()
return memberstype.toObject()
}

async function updatemembertype(id,model){
    await Membertype.findOneAndUpdate({_id:id},model)
    return
    }
    async function getmembertype(){
        let membertype=await Membertype.find()
        return membertype.map(c=>c.toObject())
        }
        async function getmembertypebyid(id){
            let membertypeid=await Membertype.findById(id)
            return membertypeid.toObject()
            }
    async function deletemembertype(id){
        await Membertype.findByIdAndDelete(id)
        return
        }
module.exports={
    addmembertype,
    updatemembertype,
    deletemembertype,
    getmembertype,getmembertypebyid
}