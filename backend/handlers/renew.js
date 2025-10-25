const Renew=require('./../db/renew')
const Members=require('./../db/members')
const Membertype=require('./../db/membership_type')
async function addrenew(model) {
    try {
        // Fetch the associated member to get membership_type
        const member = await Members.findById(model.member_id).populate('membership_type');

        if (!member) {
            throw new Error("Member not found");
        }

        // Create the renewal with membership_type
        const renewal = new Renew({
            member_id: model.member_id, // Reference to the member
            membership_type: model.membership_type?._id, // Reference to the membership type from the member
            total_amount: model.total_amount,
            renew_date: model.renew_date || Date.now() // Default to current date if not provided
        });

        // Save renewal to the database
        await renewal.save();

        // Populate the saved renewal for returning complete details
        const populatedRenewal = await renewal.populate({
            path: 'member_id',
            populate: {
                path: 'membership_type', // Populate membership_type details
                model: 'membertype'
            }
        });

        return { message: "Renewal added successfully", renewal: populatedRenewal };
    } catch (err) {
        console.error("Error adding renewal:", err);
        throw err;
    }
}

    async function getrenew(){
        try {
            const renewals = await Renew.find() .populate({
                path: 'member_id', // Populate the member_id field in Renew model
                populate: {
                    path: 'membership_type', // Populate the membership_type field in Member model
                    model: 'membertype' // Model to use for populating membership_type
                }
            });
            return renewals;
        } catch (err) {
            console.error("Error fetching renewals:", err);
            throw err;
        }
        }
        async function getrenewbyid(id){
            try {
                const renewal = await Renew.findById(id) .populate({
                    path: 'member_id', // Populate member_id field from the Member model
                    populate: {
                        path: 'membership_type', // Populate the membership_type field from the Member model
                        model: 'membertype' // Model to use for populating membership_type
                    }
                });
                console.log("Fetched renewal data:", renewal);  
                return renewal;
            } catch (err) {
                console.error("Error fetching renewal by ID:", err);
                throw err;
            }
            }
            async function updaterenew(id,model){
                try {
                    // Find renewal by ID and update it with new values
                    const renewal = await Renew.findByIdAndUpdate(id, model, { new: true })
                    .populate({
                        path: 'member_id',
                        populate: {
                            path: 'membership_type',
                            model: 'membertype'
                        }
                    });
                    return renewal;
                } catch (err) {
                    console.error("Error updating renewal:", err);
                    throw err;
                }
                }  
                async function deleterenew(memberId) {
                    try {
                        // Delete all renewals associated with the given member_id
                        const deletedRenewals = await Renew.deleteMany({ member_id: memberId });
                
                        if (deletedRenewals.deletedCount === 0) {
                            throw new Error("No renewals found for this member");
                        }
                
                        return { message: `${deletedRenewals.deletedCount} renewal(s) deleted successfully` };
                    } catch (err) {
                        console.error("Error deleting renewals:", err);
                        throw err;
                    }
                }
                
    module.exports={
        addrenew,
        updaterenew,
        deleterenew,
        // deletemembertype,
        getrenew,
        getrenewbyid
    }