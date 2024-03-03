const mongoose=require('mongoose')

const couponSchema=mongoose.Schema({
    coupon:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

couponSchema.virtual('isExpired').get(function(){
    return  this.endDate<Date.now()
})

couponSchema.pre('validate',function(next){
    if(this.endDate<Date.now()){
        return new Error('end date must less then today date')
    }
    next()
})

couponSchema.pre('validate',function(next){
    if(this.startDate<Date.now()){
        next( new  Error('start date must grater then today date'))
    }
    next()
})

couponSchema.pre('validate',function(next){
    if(this.endDate<this.startDate){
        next( new  Error('end date must grater then start date'))
    }
    next()
})

couponSchema.pre('validate',function(next){
    if(this.discount<=0){
        next(new Error('the discount must ne grater then 0'))
    }
    next()
})

const Coupon=mongoose.model('Coupon',couponSchema)

module.exports=Coupon
