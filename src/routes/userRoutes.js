const bcrypt=require('bcrypt')
const Joi=require('joi')
const express=require('express')
const router=express.Router()
const User=require('../models/userModel')

// signup Route
router.post('/users/signup',async(req,res)=>{
    const schema=Joi.object({
        name:Joi.string().min(3).max(30).required(),
        email:Joi.string().min(3).max(200).required().email(),
        password:Joi.string().min(6).max(200).required(),
    });

    const {error}=schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // duplicate Email:
    let user=await User.findOne({email:req?.body?.email})
    if(user) return res.status(400).send("User already exists...")

    user=new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
    })

    const salt=await bcrypt.genSalt(10)
    user.password=await bcrypt.hash(user.password,salt)

    await user.save()
   
    const token=await user.generateAuthToken()
    res.status(201).send({user,token})
})

//login route

router.post('/users/login',async(req,res)=>{
    const schema=Joi.object({
        email:Joi.string().min(3).max(200).required().email(),
        password:Joi.string().min(6).max(200).required(),
    });

    const {error}=schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Checking Email:
    let user=await User.findOne({email:req?.body?.email})
    if(!user) return res.status(400).send("Invalid email")

    //comparing the password
    const isValid=await bcrypt.compare(req.body.password,user.password)
    if(!isValid) return res.status(400).send("Invalid Password")

    //Token
    const token=await user.generateAuthToken()
    res.status(201).send({user,token})
})

//stripe
const Stripe = require('stripe')
const stripekey=process.env.STRIPE_KEY

const stripe=Stripe(stripekey)

router.post('/create-checkout-session', async (req, res) => {

  const line_items=req.body.cartItems.map((item)=>{
    return{
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images:[item.img],
          description:item.desc,
          metadata:{
            id:item.id,

          }
        },
        unit_amount: item.price*100,
      },
      quantity: item.cartQuantity,
    }
  })
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      shipping_address_collection:{
        allowed_countries:['US','CA','KE']
      },
      shipping_options:[
        {
          
          shipping_rate_data:{
            display_name: 'Ground shipping',
          type: 'fixed_amount',
          fixed_amount: {
            amount: 500,
            currency: 'usd',
          },
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          },
        }
      }
      ],
      line_items,
      phone_number_collection: {
        enabled: true,
      },
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
  
    res.send({url:session.url});
  });


 //stripe webhooks

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_aecb24351be35284c0096706ee22e7095f046410ae709b22cdfe9474f8746445";

router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    onslotchange.log("Verified")
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
 
  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});

module.exports=router