const express=require('express')
const authMiddleware=require('../middlewares/authMiddleware')
const {
    createBrand,
    brandList,
    getBrand,
    updateBrand,
    deleteBrand
} =require('../controllers/brandController')
const adminMiddleware=require('../middlewares/adminMiddleware')

const fileUpload=require('../config/fileUplods')

const brandRoutes=express.Router()

brandRoutes.post('/create',authMiddleware,adminMiddleware,fileUpload.single('file'),createBrand)
brandRoutes.get('/',brandList)
brandRoutes.route('/:id')
    .get(getBrand)
    .put(authMiddleware,adminMiddleware,updateBrand)
    .delete(authMiddleware,adminMiddleware,deleteBrand)

module.exports=brandRoutes