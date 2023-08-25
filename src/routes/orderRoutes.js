const express=require('express')
const router=new express.Router()
const Order = require('../models/orderModel')
const auth=require('../middleware/auth')


router.get('/orders',auth,async (req,res)=>{
  
  try{
      //const getAllUser=await Order.find({})
      //res.status(200).send(getAllUser)
      await req.user.populate('orderRel')
      res.send(req.user.orderRel)
  }catch(e){
      res.status(400).send({message:e})
  }
})

// 
const PDFDocument = require('pdfkit');
const fs = require('fs');

module.exports=router;