const mongoose = require('mongoose')
const colors= require('colors')

const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to mongoDB database ${mongoose.connection.host}`.bgGreen.white);
        
    } catch (error) {
        console.log(`mongodb Error ${error}`.bgRed.white)
        
    }


};
module.exports= connectDB