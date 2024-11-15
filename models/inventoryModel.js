const mongoose= require('mongoose');

const inventorySchema= new mongoose.Schema(
    {
        inventoryType:{
            type: String,
            require:[true, 'invantory type require'],
            enum:["in","out"],
        },
        bloodGroup:{
            type: String,
            require:[true, 'blood group is require'],
            enum:["O+","O-","AB+","AB-","A+","A-","B+","B-"],
        },
        quantity:{
            type: Number,
            require:[true, 'quantity is require'],
        },
       email:{
            type: String,
            require:[true,'Donar Email is require'],
        },
        organization:{
            type:mongoose.Schema.ObjectId,
            ref:"users",
            require:[true,'organization is require'],
        },
        hospital:{
            type:mongoose.Schema.ObjectId,
            ref:"users",
            require: function(){
                return this.inventoryType ==="out"
            }
        },
        donar:{
            type:mongoose.Schema.ObjectId,
            ref:"users",
            require: function(){
                return this.inventoryType ==="in"
            }
        }
    },{timestamps:true})
module.exports = mongoose.model("Inventory", inventorySchema);