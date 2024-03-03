const express=require('express')
const fileUpload=require('../config/fileUplods')
const {
    createCategory,
    categoryList,
    getCategory,
    updateCategory,
    deleteCategory
}=require('../controllers/categoryController')
const adminMiddleware=require('../middlewares/adminMiddleware')
const authMiddleware=require('../middlewares/authMiddleware')

const categoryRoute=express.Router()

categoryRoute.post('/create',authMiddleware,adminMiddleware,fileUpload.single('file'),createCategory)
categoryRoute.get('/',categoryList)
categoryRoute.route('/:id')
    .get(getCategory)
    .put(authMiddleware,adminMiddleware,updateCategory)
    .delete(authMiddleware,adminMiddleware,deleteCategory)

module.exports=categoryRoute
