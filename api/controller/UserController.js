const errorHandler = require("../utills/error")
const bcryptjs = require('bcryptjs')
const User = require('../model/userModel')
const Listing = require('../model/ListingModel')

const  UpdateUser = async (req,res,next) => {
    if(req.user.id !== req.params.id) return  next(errorHandler(401,'You can only Update Your Own Account.!!'))
    try {
  
  if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)
      }

      const UpdateUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar,
        }
      },{new:true})
    
      const {password, ...rest} = UpdateUser._doc
      res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}


const DeleteUser = async (req,res,next) => {
  
  if(req.user.id !== req.params.id) return  next(errorHandler(401,'You can only Delete Your Own Account.!!'))

  try {
    
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token') //For Delete Cookie Of User
    res.status(200).json({message:'User has been Delete..!!!'})

  } catch (error) {
     next(error)  
  }
}

const GetUserListing = async (req,res,next) => {
  if(req.user.id == req.params.id){
     try {
       const listings = await  Listing.find({userRef:req.params.id})
       res.status(200).json(listings)
     } catch (error) {
      next(error)
     }
  }  else {
    return next(errorHandler(401,'You can only view your own Listing.!!'))
  }

}


const GetUser = async (req,res,next) => {
    try {
      const user = await User.findById(req.params.id);
      if(!user) return next(errorHandler(404,'User Not Found.!!'));

      const {password:pass, ...rest} = user._doc;

      rs.status(200).json(rest);
    } catch (error) {
      next(error)
    }
}

module.exports = {
    UpdateUser,
    DeleteUser,
    GetUserListing,
    GetUser
}