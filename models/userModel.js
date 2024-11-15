const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    role:{
        type:String,
        require:[true,'role is requried'],
        enum:['admin','organization','donar','hospital']
    },
    name:{
type:String,
require:function(){
    if(this.role==='donar' || this.role==='admin'){
        return true
    }
    return false
}
    },
    organizationName:{
        type:String,
        require:function(){
            if(this.role==='organization'){
                return true
            }
            return false
        }
    },
    hospitalName:{
        type:String,
        require:function(){
            if(this.role==='hospital'){
                return true
            }
            return false
        }
    },
    email:{
        type:String,
        require:[true,'email is requried'],
        unique:true

    },
    password:{
        type:String,
        require:[true,'password is requried'],
    },
    address:{
        type:String,
        require:[true,'address is requried'],
    },
    phone:{
        type:String,
        require:[true,'phone number is requried'],
    }
},{timestamps:true});

module.exports = mongoose.model('users',userSchema)