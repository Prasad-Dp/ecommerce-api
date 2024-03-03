const mongoose=require('mongoose')

const randomTxt=Math.random().toString(36).substring(7).toUpperCase()
const randomNum=Math.floor(1000+Math.random()*90000)

const orderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderItems:[{
        type:Object,
        required:true
    }],
    shippingAddress:{
        type:Object,
        required:true
    },
    subtotal:{
        type:Number,
        default:0.0
    },
    discount:{
        type:Number,
        default:0.0
    },
    totalPrice:{
        type:Number,
        default:0.0
    },
    orderNumber:{
        type:String,
        default:randomTxt+randomNum
    },
    //strip payment
    paymentStatus:{
        type:String,
        default:"Not Paid"
    },
    paymentMethod:{
        type:String,
        default:"Not Specified"
    },

    currency:{
        type:String,
        default:"Not Specified"
    },
    //admin
    status:{
        type:String,
        default:"pending",
        enum:['pending','processing','shipped','delivered']
    },

    deliveredAt:{
        type:Date
    }

},{
    timestamps:true
})

const Order=mongoose.model('Order',orderSchema)

module.exports=Order