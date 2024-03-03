const User=require('../models/User')

const adminMiddleware=async(req,res,next)=>{
    const user=await User.findById(req.user)
    if(!user?.isAdmin){
        return res.status(401).json({
            status:false,
            message:"Need admin access"
        })
    }
    next()
}

module.exports=adminMiddleware