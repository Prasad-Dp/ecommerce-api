const mongoose=require('mongoose')

const reviewSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'Must login to review product']
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:[true,"Please select product want yo review"]
    },
    message:{
        type:String,
        required:[true,"please add message"]
    },
    rating:{
        type:Number,
        required:[true,'please add rating between 1 to 5'],
        min:1,
        max:5,
    }
},{
    timestamps:true
})

const Review=mongoose.model('Review',reviewSchema)

module.exports=Review