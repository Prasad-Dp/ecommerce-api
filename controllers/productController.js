const Product=require('../models/Product')
const User = require('../models/User')
const Category=require('../models/Category')
const Brand =require('../models/Brand')

const createProductCtrl=async(req,res)=>{
    try{
        console.log(req.files)
        const {name,description,brand,category,size,colors,price,totalQty}=req.body
        const convertedImgs = req.files.map((file) => file?.path);
        //featching product exist or not
        const productExist=await Product.findOne({name:name})
        if(productExist){
            return res.status(406).json({
                status:false,
                message:"Product already exists"
            })
        }
        //featching category
        const categoryModel=await Category.findOne({name:category})
        if(!categoryModel){
            return res.status(200).json({
                status:false,
                message:"Category not found"
            })
        }
        //featcing brand
        const brandModel=await Brand.findOne({name:brand})
        if(!brandModel){
            return res.status(200).json({
                status:false,
                message:"brand not found"
            })
        }
        //creating product
        const product =await Product.create({
            name,
            description,
            brand,
            category,
            size,
            colors,
            user:req.user,
            images: convertedImgs,
            price,
            totalQty
        })
        //adding to product id to category model
        categoryModel.products.push(product._id)
        await categoryModel.save()

         //adding product into barnd model
        brandModel.products.push(product._id)
        await brandModel.save()

        return res.status(201).json({
            status:true,
            message:"Product created",
            product
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            status:false,
            error:error.message
        })
    }
}

const productListCtrl=async(req,res)=>{
    try{
        let productsQuery=Product.find().populate('reviews')
        //filter by name
        if(req.query.name){
            productsQuery=productsQuery.find({
                name:{$regex:req.query.name,$options:'i'}
            })
        }
        //fillter by brand
        if(req.query.brand){
            productsQuery=productsQuery.find({
                brand:{$regex:req.query.brand,$options:'i'}
            })
        }
        //fillter by category
        if(req.query.category){
            productsQuery=productsQuery.find({
                category:{$regex:req.query.category,$options:'i'}
            })
        }
        //fillter by size
        if(req.query.size){
            productsQuery=productsQuery.find({
                size:{$regex:req.query.size,$options:'i'}
            })
        }
        //fillter by color
        if(req.query.color){
            productsQuery=productsQuery.find({
                colors:{$regex:req.query.color,$options:'i'}
            })
        }
        //aternative above commented code
        // const filters=req.query
        // Object.keys(filters).forEach(key=>{
        //     const value=filters[key]
        //     if(key!=="price" && key!=="page" && key!=="limit"){
        //         productsQuery=productsQuery.find({
        //             [key]:{$regex:value,$options:'i'}
        //         })
        //     }
        // })

        //fillter by price range
        if(req.query.price){
            const priceRange=req.query.price.split("-")
            //console.log(priceRange)
            productsQuery=productsQuery.find({
                price:{$gte:priceRange[0],$lte:priceRange[1]}
            })
        }
        //pagination disply products by pages
        //page
        const page=parseInt(req.query.page)? parseInt(req.query.page) : 1
        //limit
        const limit=parseInt(req.query.limit)?parseInt(req.query.limit):10
        //start-index
        const startIndex=(page-1)*limit
        //ending-index
        const endIndex=page*limit
        //total products
        const total=await Product.countDocuments()
        //pagging
        productsQuery=productsQuery.skip(startIndex).limit(limit)
        //pagination results
        const pagination={}
        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit,
            }
        }
        if(startIndex>0){
            pagination.prev={
                page:page-1,
                limit,
            }
        }

        const products=await productsQuery
        //console.log(products)
        if(products.length>0){
            return res.status(200).json({
                status:true,
                total,
                pagination,
                message:"Products fetched successfully",
                products
            })
        }
        return res.status(200).json({
            status:false,
            message:"No poducts Avilable"
        })

    }
    catch(error){
        return res.status(500).json({
            status:false,
            message:"something went wrong"
        })
    }
    
}

const productDetails=async(req,res)=>{
    try{
        const {productId}=req.params
        //console.log(productId)
        const product=await Product.findById(productId).populate('reviews')
        if(product){
            return res.status(200).json({
                status:true,
                product
            })
        }
        else{
            return res.status(200).json({
                status:false,
                message:"No product found"
            })
        }
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            status:true,
            message:"something went wrong"
        })
    }
}

const updateProduct=async(req,res)=>{
    try{
        const {productId}=req.params
        //console.log(productId,req.body)
        const product=await Product.findByIdAndUpdate(productId,req.body,{new:true})
        if (product) {
            return res.status(200).json({
                status: true,
                message: 'Product updated successfully',
                product,
            });
        } else {
            return res.status(404).json({
                status: false,
                message: 'Product not found',
            });
        }
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            status:true,
            message:"something went wrong"
        })
    }
}

const deleteProduct=async(req,res)=>{
    try{
        const {productId}=req.params
        await Product.findByIdAndDelete(productId)
        return res.status(200).json({
            status:true,
            message:"Deleted seccessfully"
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            status:false,
            message:"something went wrong"
        })
    }
    
}

module.exports={
    createProductCtrl,
    productListCtrl,
    productDetails,
    updateProduct,
    deleteProduct
}