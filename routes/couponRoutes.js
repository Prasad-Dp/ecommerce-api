const express=require('express')
const {
    createCoupon,
    couponList,
    getCoupon,
    updateCoupon,
    deleteCoupon
}=require('../controllers/couponController')
const adminMiddleware=require('../middlewares/adminMiddleware')
const authMiddleware=require('..//middlewares/authMiddleware')
const couponRoutes=express.Router()

couponRoutes.post('/create',authMiddleware,adminMiddleware,createCoupon)
couponRoutes.get('/',couponList)
couponRoutes.route('/:id')
    .get(getCoupon).put(authMiddleware,adminMiddleware,updateCoupon).delete(authMiddleware,adminMiddleware,deleteCoupon)

module.exports=couponRoutes