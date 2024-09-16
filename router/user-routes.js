
import express from 'express'
const userrouter=express.Router()

import{userRegister,userLogin,setToken,getMovieInfo,getShowTheatres,getShow,setPayment,verifyPayment,addBooking,getSeats,getHistory,getTheatres,getTicket,getMovies} from '../control/user-control.js'
import { verifyOtp } from '../utils/verify-otp.js'
import { verifyToken } from '../utils/verifyToken.js'



userrouter.route('/register').post(userRegister)
userrouter.route('/login').post(userLogin)
userrouter.route('/verifyotp').post(verifyOtp,setToken)
userrouter.route('/getmovies').get(getMovies)
userrouter.route('/getmovieinfo/:id').get(getMovieInfo)
userrouter.route('/getshowtheatre/:id').get(getShowTheatres)
userrouter.route('/getshow/:id').get(getShow)
userrouter.route('/payment').post(verifyToken('user'),setPayment)
userrouter.route('/verifypayment').post(verifyToken('user'),verifyPayment)
userrouter.route('/booking').post(verifyToken('user'),addBooking)
userrouter.route('/getbookings').get(getSeats)
userrouter.route('/gethistory').get(verifyToken('user'),getHistory)
userrouter.route('/gettheatres').get(getTheatres)
userrouter.route('/getticket').post(verifyToken('user'),getTicket)
export default userrouter
