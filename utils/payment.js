import Razorpay from "razorpay";
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
    });
//Function for handling payment
export const handlePayment=async(req,res)=>{

    const {amount,currency}=req.body
    console.log(amount,currency)
    const options={
        amount:amount*100,
        currency,
        receipt:`receipt_${Date.now()}`
    };
    try{
        const order=await razorpay.orders.create(options)
        console.log(order)
        res.json(order)

    }catch(error)
    {
        console.log("error",error)
    }
}
//Function for verifying the payment
export const handleVerifyPayment=(req,res)=>
{   
    const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
    console.log(req.body)
    const secret=process.env.KEY_SECRET
    const generatedSignature=crypto .createHmac('sha256', secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');
    console.log(generatedSignature)
    console.log(razorpay_signature)//Compares the signatures and if its true payment is done
    if(generatedSignature===razorpay_signature)
    {
        res.status(200).json({state:true,message:"Success"})
    }
    else
    {
        res.status(400).json({state:false,  message: 'Payment verification failed' });
    }
}

