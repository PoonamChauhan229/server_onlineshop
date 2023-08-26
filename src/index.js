
const cors = require('cors');
const express = require('express');s
const app = express();
const dotenv = require('dotenv');
const connection = require('./db/connection');
const products = require('./products');


dotenv.config();
app.use(express.json());



// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

// Router access
const userRouter = require('./routes/userRoutes');
const orderRouter=require('./routes/orderRoutes');
app.use(orderRouter)
app.use(userRouter);

const PORT = process.env.PORT || 5000;

// Db connection
const mongoose = require('mongoose');
connection();

// Routes
app.get('/', (req, res) => {
    res.status(200).send("Welcome to the Online Shop");
});

app.get('/products', (req, res) => {
    res.send(products);
});

app.listen(PORT, () => {
    console.log("Server started at PORT", PORT);
});
