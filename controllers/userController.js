const express =require('express')
const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {tokenGenerator}=require('../utils/jwttoken')
const authMiddleware=require('../middlewares/authMiddleware')

const register=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email:email})
        if(user){
            return res.status(200).json({
                status:false,
                message:"You have already an Aaccount"
            })
        }
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt)
        req.body.password=hashedpassword
        await User.create(req.body)
        return res.status(201).json({
            status:true,
            message:"Registration Seccessfull"
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            status:false,
            message:"something went wrong "
        })
    }
}

const login= async(req,res)=>{
    try{
        //console.log(req.body)
        const {email,password}=req.body
        //console.log(email,password)
        const user=await User.findOne({email:email})
        if(!user){
            return res.status(400).json({
                status:false,
                message:"You don't have account register now"
            })
        }
        const passwordIsmatch=await bcrypt.compare(password,user.password)
        if(!passwordIsmatch){
            return res.status(400).json({
                status:false,
                message:"Incorrect password"
            })
        }
        return res.status(202).json({
            status:true,
            message:"Login seccessfull",
            user,
            token:tokenGenerator(user._id),

        })
    }
    catch(error){
        return res.status(400).json({
            status:false,
            message:"something went wrong"
        })
    }
}

const getUser=async(req,res)=>{
    const userId=req.user
    //console.log(userId)
    const user=await User.findById(userId).populate('orders')
    return res.json({user})

}

const getUsersList=async(req,res)=>{
    const users=await User.find()
    return res.status(200).json({
        status:true,
        users
    })
}

const updateShippingAddress=async(req,res)=>{
    try{
        const {name,phone,address,city,state,pincode,country}=req.body

        console.log(name,phone,address,city,state,pincode,country)

        const user=await User.findByIdAndUpdate(req.user,{
            shippingAddress:{
                name,phone,address,city,state,pincode,country
            },
            hasShippindAddress:true
        },{new:true})
        return res.status(200).json({
            status:true,
            message:"Address Added",
            user
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



module.exports={register,login,getUser,updateShippingAddress,getUsersList}