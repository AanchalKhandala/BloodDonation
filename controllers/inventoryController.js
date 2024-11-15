const  mongoose  = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
    try {
        const { email, inventoryType, bloodGroup, quantity, userId } = req.body;

        // Validation: Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        console.log(`User Role: ${user.role}, Inventory Type: ${inventoryType}`);

        // Validate inventory type and user role
        if (inventoryType === "in" && user.role !== 'donar') {
            throw new Error('Account is not authorized to add inventory');
        }
        if (inventoryType === 'out' && user.role !== 'hospital') {
            throw new Error('Account is not authorized to remove inventory');
        }

        if (inventoryType === 'out') {
            const requestedBloodGroup = bloodGroup;
            const requestedQuantityOfBlood = quantity;
            const organization = new mongoose.Types.ObjectId(userId);

            // Calculate blood quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: 'in',
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' }
                    }
                }
            ]);

            const totalIn = totalInOfRequestedBlood[0]?.total || 0;

            // Total out blood
            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: 'out',
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' }
                    }
                }
            ]);

            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            // Calculate available quantity
            const availableQuantityOfBloodGroup = totalIn - totalOut;

            // Quantity validation
            if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id;
        }

        // Save record to inventory
        const inventory = new inventoryModel(req.body);
        await inventory.save();

        return res.status(201).send({
            success: true,
            message: 'New blood record added successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in create inventory API',
            error: error.message
        });
    }
};


//GET ALL BLOOD RECORDS
const getInventoryController=async(req, res)=>{
    try {
        const inventory= await inventoryModel.find({organization: req.body.userId,}).populate("donar").populate("hospital").sort({createdAt: -1})
        return res.status(200).send({
            success: true,
            message: 'All  blood record fetched successfully',
            inventory,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in get all inventory API',
            error: error.message
        });
    }

};

//GET DONAR RECORD
const getDonarsController = async(req,res)=>{
    try {
        const organization = req.bosy.userId
        //find donar
        const donarId = await inventoryModel.distinct('donar',{
            organization
        });
        const donars= await userModel.find({_id:{$in:donarId}})
        return res.status(200).send({
            success:true,
            message:'Donar Record Fetch Successfully',
            donars,
        })
        //console.log(donars)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in Donar Records',
            error
        })
    }
   
}


module.exports = { createInventoryController, getInventoryController, getDonarsController };
