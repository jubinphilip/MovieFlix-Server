import { main } from '../model/db-connect.js';
import { adminModel, movieModel, theatreModel } from '../model/admin-db.js';
main().catch(err => console.error('Database connection error:', err)); // Main function for connecting to database
import { handleDeletion, handleNewMovie, handleAdminLogin, handleTheatreAdd, handleMovieEdit, handleSelectedMovieRequest, handleShows, handleShowRequest, handleUpdateMovies } from '../Repo/admin-repo.js';
import bcrypt from 'bcrypt';
import {movieValidationSchema,theatreSchema} from '../Request/manage-admin-request.js';
const saltRounds = 10;

// Function for creating an admin
export const createAdmin = async (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.log("Error hashing password");
            return res.status(500).json({ message: "Error hashing password" });
        }
        try {
            await adminModel.create({
                email,
                password: hash // Inserting hashed password into db
            });
        } catch (error) {
            console.log(error);
        }
    });
};

// Function for admin login
export const adminLogin = async (req, res) => {
    console.log(req.body)
    const response = await handleAdminLogin(req);
    res.status(response.statusCode).json(response.body); // Send response here
};

// Function for adding new movies
export const addMovies = async (req, res) => {
    const { title, description, language, genre, rating, summary, actor, actress, director, production } = req.body;
    const { error } = movieValidationSchema.validate({ title, description, language, genre, rating, summary, actor, actress, director, production });
    if (error) {
        console.log(error)
        return res.status(400).json({ message: error.details[0].message });
    }

    const response = await handleNewMovie(req);
    res.status(response.statusCode).json(response.body); // Send response here
};

// Function for getting all movies
export const getMovies = async (req, res) => {
    try {
        const movies = await movieModel.find({});
        res.status(200).json(movies);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve movies' });
    }
};

// Function for updating a movie
export const updateMovies = async (req, res) => {
    const response = await handleUpdateMovies(req);
    res.status(response.statusCode).json(response.body);
};

// Function for adding theatre
export const addTheatre = async (req, res) => {
    const { theatrename, theatreloc, ticketprice, seats } = req.body;
    const { error } = theatreSchema.validate({ theatrename, theatreloc, ticketprice,seats})
    if (error) {
        console.log(error)
        return res.status(400).json({ message: error.details[0].message });
    }
    const response = await handleTheatreAdd(req);
    res.status(response.statusCode).json(response.body);
};

// Function for getting the theatre list
export const getTheatre = async (req, res) => {
    try {
        const theatres = await theatreModel.find({});
        res.status(200).json(theatres);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to retrieve theatres" });
    }
};

// Function for editing movies in a theatre
export const editMovies = async (req, res) => {
    const response = await handleMovieEdit(req);
    res.status(response.statusCode).json(response.body);
};

// Function for getting selected movie list
export const getSelectedMovies = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const response = await handleSelectedMovieRequest(id);
    res.status(response.statusCode).json(response.body);
};

// Function for adding shows
export const addShows = async (req, res) => {
    const response = await handleShows(req);
    res.status(response.statusCode).json(response.body);
};

// Function for getting shows
export const getShows = async (req, res) => {
   // console.log(req.body);
    const response = await handleShowRequest(req);
    res.status(response.statusCode).json(response.body);
};

// Function for deleting a show
export const deleteShows = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const response = await handleDeletion(id);
    res.status(response.statusCode).json(response.body);
};
