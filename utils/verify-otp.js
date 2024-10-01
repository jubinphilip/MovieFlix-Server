import nodemailer from 'nodemailer'
import randomstring from 'randomstring';
import dotenv from 'dotenv';
dotenv.config();
const otpCache={};
let globalEmail;

//function for creating a random string as otp
export function createOtp()
{
    console.log("otp generated")
    return randomstring.generate({length:6,charset:'numeric'})//otp is a 6 length numeric string
}
//Function calls the setotp function and pass email as argument
export function setOtp(email)
{
    console.log(email)
    globalEmail=email//setting the mail to global so that sendotp and verifyotp both functions can access it
    console.log(globalEmail)
    generateOtp()//calls the generateOtp function for generating otp
}
export function sendOtp(email,otp)//Function for sending otp
{
    const mailoptions={
        from:'jubinphilip25@gmail.com',
        to:email,
        subject:"Otp Verification",
        text:`Your otp is ${otp}`
    };
    console.log("Sending Otp")
    const transporter=nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.EMAIL,//senders email
            pass:process.env.APP_PASS//senders app password
        },
        tls:{
            rejectUnauthorized:false
        }
    });
//Function used fr senfing email
    transporter.sendMail(mailoptions,(err,info)=>{
        if(err)
            console.error("Error sending Otp:",err)
        else
            console.log('OTP sent:',info.response)
    });
}


export const generateOtp=async(req,res)=>{//Function which initialises otp sending process
    try{
     console.log(globalEmail)
    const otp=createOtp()
    console.log(otp)
    otpCache[globalEmail]=otp
    console.log(otpCache)
    
    await sendOtp(globalEmail,otp)//sending email and generated otp to sendotp function
    res.cookie('otpCache',JSON.stringify(otpCache),{maxAge:500000,httpOnly:true})//Stores email and otp in a cookie
    console.log("OTP sent")
    }
    catch(error){
        console.error('Error Sending OTP:',error)
    }
}
export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        console.log(otp, email);

        // Check if email exists in the cache
        if (!otpCache.hasOwnProperty(email)) {
            return res.status(400).json({ message: 'Email not found' });
        }

        // Check if OTP matches the one stored in the cache
        if (otpCache[email] === otp.trim()) {
            // Remove OTP from cache after successful verification
            delete otpCache[email];
            console.log("OTP verified");

            // If OTP is verified, attach the email to the req object and call next()
            req.email = email;
            next(); // Pass control to the next middleware or route handler
        } else {
            console.log("Invalid OTP");
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ status: 0, message: 'Failed to verify OTP' });
    }
};

