import { main } from '../model/db-connect.js'
import { createToken,decodeToken } from '../utils/manage-token.js'
import {handleMovieRequest,handleUserLogin, handleUser,handleTheatreRequest,handleShowRequest,handleBookings,handleSeatRequest,handleHistoryRequest, handleAllTheatreRequest,handleTickets} from  '../Repo/user-repo.js'
import {handlePayment,handleVerifyPayment} from '../utils/payment.js'
import { userModel } from '../model/user-db.js'
import { movieModel } from '../model/admin-db.js'
main().catch(err => console.error('Database connection error:', err))
import dotenv from 'dotenv';
dotenv.config();

//Function for registration
export const userRegister = async(req,res) => {
    try {
        await handleUser(req.body,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}
//Function for login
export const userLogin = async(req,res) => {
    try {
        await handleUserLogin(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}
//Function for getting movies to the client
export const getMovies = async(req,res) => {
    try {
        const movies = await movieModel.find({})
        res.json(movies)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function for setting token 
export const setToken = async(req,res) => {
    try {
        const {email} = req.body
        console.log(email)
        const data = await userModel.find({email:email})
        if(data.length>0) {
            res.json({status:1,message:"User Logged in",username:data[0].username})
        } else {
            res.status(404).json({message: 'User not found'})
        }
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function for Displaying a particular movie information
export const getMovieInfo = async(req,res) => {
    try {
        const{id} = req.params
        await handleMovieRequest(id,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function for displaying theatres which the movie runs
export const getShowTheatres = async(req,res) => {
    try {
        const{id} = req.params;//Recieves show id in params from client sidee
        await handleTheatreRequest(id,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function for displaying shiw times of a movie
export const getShow = async(req,res) => {
    try {
        const{id} = req.params//Recieves show id in params
        await handleShowRequest(id,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function which deals with user bookings 
export const Bookings = async(req,res) => {
    try {
        await handleBookings(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function deals with payment
export const setPayment = async(req,res) => {
    try {
        await handlePayment(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function deals with payment verfication razorpay
export const verifyPayment = async(req,res) => {
    try {
        await handleVerifyPayment(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function for adding new booking by the user
export const addBooking = async(req,res) => {
    try {
        await handleBookings(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function for getting booked seats for a particular show
export const getSeats = async(req,res) => {
    try {
        await handleSeatRequest(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function for showing the user his previous bookings
export const getHistory = async(req,res) => {
    try {
        await handleHistoryRequest(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}


//Function for Listing all theatres
export const getTheatres = async(req,res) => {
    try {
        await handleAllTheatreRequest(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

//Function for generating qr code regarding ticket inforation
export const getTicket = async(req,res) => {
    try {
        await handleTickets(req,res)
    } catch(err) {
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}