const express=require('express')
const {createReview}=require('../controllers/reviewController')
const authMiddleware=require('../middlewares/authMiddleware')
const reviewRoutes=express.Router()

reviewRoutes.post('/:id',authMiddleware,createReview)

module.exports=reviewRoutes