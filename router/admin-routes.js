
import express from 'express';
const adminrouter=express.Router()
import multer from 'multer';
//const path = require('path');
import path from 'path'
import {verifyToken} from '../utils/verifyToken.js'
import { adminLogin,addMovies,getMovies,addTheatre,getTheatre,editMovies,getSelectedMovies,addShows,getShows,deleteShows, createAdmin,updateMovies} from '../control/admin-control.js';

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize Multer with the configured storage
const upload = multer({ storage: storage });

// Routes for handling various admin functions
adminrouter.route('/createadmin').post(createAdmin);
adminrouter.route('/login').post(adminLogin)
//Route for handling movies
adminrouter.route('/addmovies').post(verifyToken('admin'),upload.fields([{ name: 'poster', maxCount: 1 },{ name: 'actor_image', maxCount: 1 },{ name: 'actress_image', maxCount: 1 }]),addMovies);
adminrouter.route('/updatemovie/:id').post(verifyToken('admin'),upload.fields([{ name: 'poster', maxCount: 1 },{ name: 'actor_image', maxCount: 1 },{ name: 'actress_image', maxCount: 1 }]),updateMovies);
adminrouter.route('/getmovies').get(getMovies)
adminrouter.route('/addtheatre').post(verifyToken('admin'),addTheatre)
adminrouter.route('/gettheatre').get(verifyToken('admin'),getTheatre)
adminrouter.route('/editmovies').post(verifyToken('admin'),editMovies)
adminrouter.route('/gettheatre/:id').get(verifyToken('admin'),getSelectedMovies)
adminrouter.route('/addshows').post(verifyToken('admin'),addShows)
adminrouter.route('/getshows').get(verifyToken('admin'),getShows)
adminrouter.route('/deleteshow/:id').delete(verifyToken('admin'),deleteShows)

export default adminrouter
