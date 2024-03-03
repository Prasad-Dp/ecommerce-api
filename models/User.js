const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order'
    },],
    wishList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },],
    isAdmin:{
        type:Boolean,
        default:false
    },
    hasShippindAddress:{
        type:Boolean,
        default:false
    },
    shippingAddress:{
        name:{
            type:String,
        },
        phone:{
            type:String,
        },
        address:{
            type:String,
        },
        city:{
            type:String,
        },
        state:{
            type:String,
        },
        pincode:{
            type:String,
        },
        country:{
            type:String,
            default:"india"
        }
    }
},{
    timestamps:true
})

const User=mongoose.model('User',UserSchema)

module.exports=User