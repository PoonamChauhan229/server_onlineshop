const express=require('express')
const cors=require('cors')
const app=express()

const dotenv=require('dotenv')
dotenv.config()

const PORT=process.env.PORT ||5000
const mongoose=require('mongoose')
//Db connection
const connection=require('./db/connection')
connection()

const products= require('./products')
app.use(cors())
app.use(express.json())


// routes
app.get('/',async(req,res)=>{
    res.status(200).send("Welcome to the Online Shop")
})

// products route
app.get('/products',async(req,res)=>{
    res.send(products)
})

app.listen(PORT,()=>{
    console.log("server started at PORT",PORT)
})
