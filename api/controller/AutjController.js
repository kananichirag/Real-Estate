const User = require('../model/userModel')
const path = require('path')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorHandler = require('../utills/error')
const { match } = require('assert')

require('dotenv').config({path:path.join(__dirname,'../.env')})


const Signup = async (req,res,next) => {
    
        const {username,email,password} = req.body;
        const HashPassword = bcryptjs.hashSync(password,10)
        const newuser = new User({username,email,password:HashPassword})
        try {    
        await newuser.save()
        res.status(200).json({msg:"User Created Succfully.!!!"})
    } catch (error) {
        next(error)
    }
}


const Signin = async (req,res,next) => {
  const {email,password} = req.body;
  try {

   // Checking Email And Password 
   const validUser = await User.findOne({email})
   if(!validUser) return next(errorHandler(404,'User Not Found.!!!'))
   const validPass = await bcryptjs.compare(password, validUser.password)
   if(!validPass)  return next(errorHandler(404,'Incorrect Password..!!'))

   // For JWT Token
   const token = jwt.sign({id:validUser._id},process.env.JWT_SECRATE)
   // Using This We can not Send Password in Data(In Return Data)
   const {password:pass, ...rest} = validUser._doc;

   res
   .cookie('access_token',token,{httpOnly:true})
   .status(200)
   .json(rest) 

  } catch (error) {
    next(error)
  }
}


const Google = async (req,res,next) => {
   try {
    
     const user = await User.findOne({email:req.body.email})
     if(user) {
      const token = jwt.sign({id:user._id},process.env.JWT_SECRATE)
      const {password:pass, ...rest} = user._doc

      res
      .cookie('access_token',token,{httpOnly:true})
      .status(200)
      .json(rest)
     }  else {
        const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashPass = bcryptjs.hashSync(generatePassword,10)
        const newuser = new User({username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),  email:req.body.email, password:hashPass, avatar:req.body.photo})
        await newuser.save()

        const token = jwt.sign({id:newuser._id},process.env.JWT_SECRATE)
        const {password:pass, ...rest} = newuser._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
     }
  

   } catch (error) {
    next(error)
   }
}


const SignOut = async (req,res,next) => {
  try {
    
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out..!!')

  }catch (error) {
    next(error)
  }
}

module.exports = {
    Signup,
    Signin,
    Google,
    SignOut
}