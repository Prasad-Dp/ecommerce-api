const jwt =require('jsonwebtoken')

const tokenGenerator=(id)=>{
    return jwt.sign({id:id},process.env.JWT_KEY,{expiresIn:'2d'})
}

module.exports={tokenGenerator}