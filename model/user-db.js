
import mongoose from "mongoose"
import { showModel } from "./admin-db.js"
import { theatreModel } from "./admin-db.js"
import { movieModel } from "./admin-db.js"
const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    phone:String,
    password:String
}, { timestamps: true } )

export const userModel=new mongoose.model('user',userSchema)

const bookingSchema=new mongoose.Schema({
    showid:{ type: mongoose.Schema.Types.ObjectId, ref: 'shows'},
    booked_date:String,
    bookedSeats: [String],
    theatreid:{type: mongoose.Schema.Types.ObjectId, ref:'theatres'},
    movieid:{type: mongoose.Schema.Types.ObjectId, ref: 'movies'},
    userid:{ type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    amount:String
},{timestamps:true})

export const bookingModel=new mongoose.model('Bookings',bookingSchema)

