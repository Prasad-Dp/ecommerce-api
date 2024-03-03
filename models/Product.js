const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    category:{
        type:String,
        ref:"Category",
        required:true
    },
    size:{
        type:[String],
        enum:['S','M','L','XL','XXL'],
        required:true
    },
    colors:{
        type:[String],
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    images:[
    {
        type:String,
        default:"no_image"
    }],
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }],
    price:{
        type:Number,
        required:true
    },
    totalQty:{
        type:Number,
        required:true
    },
    totalSold:{
        type:Number,
        required:true,
        default:0
    },
},{
    timestamps:true,
    toJSON:{virtuals:true}
})

//special opreations
productSchema.virtual('totalReviews').get(function(){
    return this?.reviews?.length
})

productSchema.virtual('avearageRating').get(function(){
    let total=0
    this.reviews.forEach((review)=>{
        total+=review?.rating
    })
    return total/this?.reviews?.length
})

productSchema.virtual('totalleft').get(function(){
    return this.totalQty-this.totalSold
})

const Product=mongoose.model('Product',productSchema)

module.exports=Product