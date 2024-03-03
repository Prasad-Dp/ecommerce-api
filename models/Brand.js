const mongoose=require('mongoose')

const brandSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    image:{
        type:String,
        default:"no_image"
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]
},{
    timestamps:true,
})

const Brand=mongoose.model('Brand',brandSchema)

module.exports=Brand