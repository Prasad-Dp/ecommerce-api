const express=require('express')
const {register,login,getUser,updateShippingAddress,getUsersList}=require('../controllers/userController')
const authMiddleware=require('../middlewares/authMiddleware')
const adminMiddleware=require('../middlewares/adminMiddleware')
const userRoute=express.Router()

userRoute.post('/register',register)
userRoute.post('/login',login)
userRoute.get('/getuser',authMiddleware,getUser)
userRoute.get('/',authMiddleware,adminMiddleware,getUsersList)
userRoute.post('/address',authMiddleware,updateShippingAddress)

module.exports=userRoute