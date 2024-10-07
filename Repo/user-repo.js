import { movieModel, showModel, theatreModel } from '../model/admin-db.js';
import { generateQrcode } from '../utils/generateQr.js';
import { main } from '../model/db-connect.js';
import { setOtp } from '../utils/verify-otp.js'
import { createToken,decodeToken } from '../utils/manage-token.js';
import { bookingModel, userModel } from '../model/user-db.js'
import bcrypt from 'bcrypt'
import userValidationSchema from '../Request/manage-user-request.js';
const saltRounds=10

main().catch(err => console.error('Database connection error:', err))


//Handles Registration of a user
export async function handleUser(data, res) {
    try {
        const { username, email, phone, password } = data;
        //user is validated using joi package the details from client is passed to userValidation
        const { error } = userValidationSchema.validate({ username, email, phone, password });

        if (error) {
            console.log(error)
            return res.status(400).json({ message: error.details[0].message });
        }

        const record = await userModel.find({ email: email });
        
        if (record.length > 0) {
            console.log("Email already exists");
            return res.status(409).json({ message: "Email already exists" });
        } else {
            //hasing the passsword using bcrypt
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log("Error hashing password");
                    return res.status(500).json({ message: "Error hashing password" });
                }
                try {
                    await userModel.create({
                        username,
                        email,
                        phone,
                        password: hash//inserting hashed password to db
                    });
                    return res.status(200).json({ message: "User registered successfully" });
                } catch (err) {
                    console.log("Error generated during registration", err);
                    return res.status(500).json({ message: "Error during registration" });
                }
            });
        }
    } catch (err) {
        console.log("Error in handleUser function", err);
        return res.status(500).json({ message: "Server error" });
    }
}

//handling user login
export const handleUserLogin=async(req,res)=>{
    const{email,password}=req.body
    const {credential}=req.body
    console.log(credential)
    if(credential)//if user logins with google auth this funtion works 
    {
        const googletoken=decodeToken(credential)//decodes the credential from client side and from it the email can be identified
        console.log(googletoken)
        const data=await userModel.find({email:googletoken.email})//checks whether email exis in db or not
        if(data.length>0)
        {
            setOtp(googletoken.email)
            const token=createToken(data,'user')//if user exists then creates jwt token for him
            res.json({status:1,message:"Otp Sent",email:googletoken.email,token:token,data:data[0]})
        }
        else
        {
            res.json({status:0,message:"No user Found"})
        }
    }
    else
    {
    //if usre login with email and password this function works
    const data=await userModel.find({email:email})
    console.log("Data",data)
    const result= await bcrypt.compare(password,data[0].password)
    console.log(result)
    if(result)
    {
  
        const token=createToken(data,'user')
        console.log("user login")
        res.json({status:1,message:"User Loginned",token:token,data:data[0]})
    }
    else
    {
        console.log("Login failed")
        res.json({status:0,message:"No user Found"})
    }
    console.log(email,password)
}
}
//Function for shwoing details of a particular movie to the user
export async function handleMovieRequest(id,res) 
{
    try {
        console.log(id)
        const data=await movieModel.find({_id:id})
        if(data.length>0)
        {
        console.log(data[0])
        return res.status(200).json(data[0])
        }
        else
        {
            return res.status(400).json("no data found")
        }
    } catch (err) {
        console.log("Error in handleMovieRequest function", err);
        return res.status(500).json({ message: "Server error" });
    }
}

//Function for showing thetares with a particular movie selected by the user
export async function handleTheatreRequest(id,res)
{
    try {
        console.log(id)
        const data=await showModel.find({movie_id:id})
        .populate('movie_id','title language poster')
        .populate('theatre_id','theatrename theatreloc ticketprice seats')     
          if(data.length>0)
          {
            console.log(data)
            res.status(200).json(data)
           }
          else
          {
            res.status(400).json("No Data Found")
          } 
    } catch (err) {
        console.log("Error in handleTheatreRequest function", err);
        return res.status(500).json({ message: "Server error" });
    }
}

//Function for showing details of a show that is time availability of seats 
export async function handleShowRequest(id,res) 
{
    console.log(id)
    try{
        const data = await showModel.findById(id).populate('theatre_id', 'ticketprice');
        console.log(data)
        if(data)
        {
            res.status(200).json(data)
        }
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({ message: "Server error" });
    }   
}

//Function which handles the booking by the users
export async function handleBookings(req, res) {
    const { showid, booked_date, bookedSeats, movieid, theatreid, userid, amount } = req.body;

    try {
        console.log(`Number of booked seats: ${bookedSeats.length}`);

//creating new booking from user
        const newBooking= await bookingModel.create({
            showid,
            booked_date,
            bookedSeats,
            movieid,
            theatreid,
            userid,
            amount
        });

        const show = await showModel.findById(showid);

        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        let seatsAvailable = Number(show.seats);
//Compares number of remaining seats
        if (isNaN(seatsAvailable) || seatsAvailable < bookedSeats.length) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }
        console.log("Booking  id",newBooking._id)
        show.remaining_seats-=bookedSeats.length
        await show.save()
        res.status(200).json({ message: 'Booking successful',bookingId:newBooking._id});
        
    } catch (error) {
        console.error("Error handling booking:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
//Function for getting already booked seats
export async function handleSeatRequest(req,res){
    try {
        console.log("seats")
        console.log(req.query)
        const{showid,date}=req.query
        const bookings = await bookingModel.find({//booked seats are filtered out by showid and booked_date
            showid: showid,
            booked_date: date
        });
        const bookedSeats=bookings.map(booking=>booking.bookedSeats).flat();//making all seats into a single array using flat
        console.log("bookedSeats",bookedSeats)
        res.json({bookedSeats:bookedSeats})
    } catch (err) {
        console.log("Error in handleSeatRequest function", err);
        return res.status(500).json({ message: "Server error" });
    }
}

//Function for showing the user his booking history
export async function handleHistoryRequest(req,res){
    const{userid}=req.query
    console.log(userid)
    try
    {
        let data = await bookingModel.find({ userid: userid })
        .populate('showid','timing')
        .populate('theatreid','theatrename ticketprice')
        .populate('movieid','title  language poster')
        if(data)
        {
            res.status(200).json(data)
        }
        else
        {
            res.status(400).json({message:"No Data Found"})
        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: "Server error" });
    }
}
//Function for displaying all theares to user
export async function handleAllTheatreRequest(req, res) {
    try {
        const uniqueTheatreIds = await theatreModel.distinct('_id', {});

        const data = await theatreModel.find({ _id: { $in: uniqueTheatreIds } })
            .populate({ path: 'movies.movie1', select: 'title poster' })
            .populate({ path: 'movies.movie2', select: 'title poster' })
            .populate({ path: 'movies.movie3', select: 'title poster' });
        
        console.log(data);
        data.forEach(theatre => {//getting all movies runing on that theatre
            console.log(`Theatre: ${theatre.theatrename}`);
            console.log(`Movie 1: ${theatre.movies.movie1 ? theatre.movies.movie1.title : 'Not populated'}`);
            console.log(`Movie 2: ${theatre.movies.movie2 ? theatre.movies.movie2.title : 'Not populated'}`);
            console.log(`Movie 3: ${theatre.movies.movie3 ? theatre.movies.movie3.title : 'Not populated'}`);
        });

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching theatre data:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
//Function for generating qrcode
export async function  handleTickets(req,res) {
    try {
        const{id}=req.body
        //console.log("From body",id)
        const data=await bookingModel.find({_id:id})
            .populate('showid','timing')
            .populate('theatreid','theatrename ticketprice')
            .populate('movieid','title  language poster')
            .populate('userid','username phone')
        console.log(data[0])
        const qrcode=await generateQrcode(data[0])//the data is passed to generateQrcode for generating a qr code with tickt info
        res.status(200).json({qrcode:qrcode})
    } catch (err) {
        console.log("Error in handleTickets function", err);
        return res.status(500).json({ message: "Server error" });
    }
}