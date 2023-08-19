const express=require('express')
const router=new express.Router()
const Order = require('../models/orderModel')

router.get('/orders',async (req,res)=>{
  
  try{
      const getAllUser=await Order.find({})
      res.status(200).send(getAllUser)
  }catch(e){
      res.status(400).send({message:e})
  }
})

module.exports=router;