const Review=require('../models/Review')
const Product=require('../models/Product')


const createReview=async(req,res)=>{
    try{
        const {message,rating}=req.body
        //console.log(req.body)
        const product=await Product.findById(req.params.id).populate('reviews')
        if(!product){
            return res.status(400).json({
                status:false,
                message:"no product found"
            })
        }
        //checking user alredy reviewd or not
        const isReviewd=product.reviews.find((review)=>{
            return review?.user?.toString()===req.user.toString()
        })

        if(isReviewd){
            return res.status(400).json({
                status:false,
                message:"already reviewed"
            })
        }


        //creating review
        const review=await Review.create({
            user:req.user,
            product:product?._id,
            message:message,
            rating:rating
        })

        product.reviews.push(review?._id)
        await product.save()

       

        return res.status(200).json({
            status:true,
            message:"Review added"
        })

    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            status:true,
            message:"something went wrong"
        })
    } 
}

module.exports={createReview}