const mongoose=require('mongoose')

const ColorSchema=mongoose.Schema({
    color:{
        type:String,
        required:true,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
},{timestamps:true})

const Color=mongoose.model('Color',ColorSchema)

module.exports=Color