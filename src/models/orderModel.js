const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    customerId:{
        type:String,
    },
    paymentIntentId:{
        type:String,
    },
    products:[
        {
        id:{type:String},
        name:{type:String},
        img:{type:String},
        company:{type:String},
        desc:{type:String},
        cartQuantity:{type:Number},   
    }
    ],
    subtotal:{type:Number,require:true},
    total:{type:Number,require:true},
    shipping:{type:Object,require:true},
    delivery_status:{type:String,default:"pending"},
    payment_status:{type:String,require:true},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User" //Model Name
    }
},
{timestamps:true}
)
const Order=mongoose.model('Order',orderSchema)

module.exports=Order