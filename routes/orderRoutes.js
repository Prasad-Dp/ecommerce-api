const express=require('express')
const authMiddleware=require('../middlewares/authMiddleware')
const {orderCtrl,ordersList,getOrder,
    updateOrder,getSaleSum,todaySales
}=require('../controllers/orderController')
const orderRoutes=express.Router()
const adminMiddleware=require('../middlewares/adminMiddleware')

orderRoutes.post('/neworder',authMiddleware,orderCtrl)
orderRoutes.get('/',authMiddleware,ordersList)
orderRoutes.route('/:id')
    .get(authMiddleware,getOrder)
    .put(authMiddleware,adminMiddleware,updateOrder)
orderRoutes.get('/sales/report',authMiddleware,adminMiddleware,adminMiddleware,getSaleSum)
orderRoutes.get('/sales/today',authMiddleware,adminMiddleware,todaySales)

module.exports=orderRoutes