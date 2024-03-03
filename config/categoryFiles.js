const multer=require('multer')
const cloudinaryPackage=require('cloudinary')
const {CloudinaryStorage}=require('multer-storage-cloudinary')
const cloudinary=cloudinaryPackage.v2

cloudinary.config({
    cloud_name:process.env.CLOUDNARY_NAME,
    api_key:process.env.CLOUDNARY_API_KEY,
    api_secret:process.env.CLOUDNARY_API_SECRET_KEY
})

const storage=new CloudinaryStorage({
    cloudinary,
    allowedFormats:['jpg','jpeg','png'],
    params:{
        folder:'ecommerce-api'
    }
})

const categoryUpload=multer({
    storage,
})

module.exports=categoryUpload