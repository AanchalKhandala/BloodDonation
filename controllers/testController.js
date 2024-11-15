const testController =(req,res)=>{
    res.status(200).send({
        message:'welcom test route',
        success:true
    });
};
module.exports={testController}