import bcrypt from 'bcrypt';
import { adminModel, movieModel, theatreModel, showModel } from '../model/admin-db.js';
import { createToken } from '../utils/manage-token.js';

// Function for logging in admin
export const handleAdminLogin = async (req) => {
    const { email, password } = req.body;
    try {
        const data = await adminModel.find({ email });
        const result = await bcrypt.compare(password, data[0].password);
        if (result) {
            const token = createToken(data, 'admin');
            return { statusCode: 200, body: { message: "Loginned", token } };
        } else {
            return { statusCode: 400, body: { message: "Login failed" } };
        }
    } catch (error) {
        console.error("Error during login:", error);
        return { statusCode: 500, body: { message: "Internal server error" } };
    }
};

// Function for adding a new movie
export const handleNewMovie = async (req) => {
    const { title, description, language, genre, rating, summary, actor, actress, director, production } = req.body;
    const poster = req.files['poster'] ? req.files['poster'][0].filename : null;
    const actor_image = req.files['actor_image'] ? req.files['actor_image'][0].filename : null;
    const actress_image = req.files['actress_image'] ? req.files['actress_image'][0].filename : null;
    try {
        await movieModel.create({
            title, description, language, genre, rating, poster, summary,
            cast: { actor, actor_image, actress, actress_image, director, production }
        });
        return { statusCode: 200, body: { message: "Movie inserted" } };
    } catch (error) {
        return { statusCode: 500, body: { message: "Failed to add movie", error } };
    }
};

// Function for updating a movie
export const handleUpdateMovies = async (req) => {
    const { id } = req.params;
    const { title, description, language, genre, rating, summary, actor, actress, director, production } = req.body;
    const poster = req.files['poster'] ? req.files['poster'][0].filename : undefined;
    const actor_image = req.files['actor_image'] ? req.files['actor_image'][0].filename : undefined;
    const actress_image = req.files['actress_image'] ? req.files['actress_image'][0].filename : undefined;
    try {
        const movie = await movieModel.findById(id);
        if (!movie) return { statusCode: 404, body: { message: "Movie not found" } };
        movie.title = title || movie.title;
        movie.description = description || movie.description;
        movie.language = language || movie.language;
        movie.genre = genre || movie.genre;
        movie.rating = rating || movie.rating;
        movie.summary = summary || movie.summary;
        if (poster) movie.poster = poster;
        if (actor_image) movie.cast.actor_image = actor_image;
        if (actress_image) movie.cast.actress_image = actress_image;
        await movie.save();
        return { statusCode: 200, body: { message: "Movie updated successfully" } };
    } catch (error) {
        return { statusCode: 500, body: { message: "Failed to update movie", error } };
    }
};

// Function for adding a theatre
export const handleTheatreAdd = async (req) => {
    const { theatrename, theatreloc, ticketprice, seats, movie1, movie2, movie3 } = req.body;
    try {
        await theatreModel.create({ theatrename, theatreloc, ticketprice, seats, movies: { movie1, movie2, movie3 } });
        return { statusCode: 200, body: { message: "New theatre added" } };
    } catch (error) {
        return { statusCode: 400, body: { message: "Unable to Insert Theatre" } };
    }
};

// Function for editing movies in a theatre
export const handleMovieEdit = async (req) => {
    const { theatrename, movie1, movie2, movie3 } = req.body;
    try {
        const updatedTheatre = await theatreModel.findOneAndUpdate(
            { theatrename },
            { $set: { 'movies.movie1': movie1, 'movies.movie2': movie2, 'movies.movie3': movie3 } },
            { new: true, useFindAndModify: false }
        );
        return { statusCode: 200, body: { message: "Data Edited" } };
    } catch (error) {
        return { statusCode: 500, body: { message: "Error Occurred" } };
    }
};

// Function for getting selected movie list
export const handleSelectedMovieRequest = async (id) => {
    const theatre = await theatreModel.findById(id).populate({
        path: 'movies.movie1 movies.movie2 movies.movie3',
        select: 'title'
    });
    if (theatre) {
        const movies = {
            movie1: theatre.movies.movie1 || null,
            movie2: theatre.movies.movie2 || null,
            movie3: theatre.movies.movie3 || null
        };
        return { statusCode: 200, body: movies };
    }
};

// Function for adding shows
export const handleShows = async (req) => {
    const { movie_id, theatre_id, seats, timing, from_date, to_date } = req.body;
    try {
      await showModel.create({
        movie: movie_id,
        theatre: theatre_id,
        seats,
        timing,
        from_date,
        to_date
    });
    return { statusCode: 200, body: { message: "Show added successfully" } };
} catch (error) {
    return { statusCode: 500, body: { message: "Failed to add show", error } };
}
};


// Function to handle fetching shows
export const handleShowRequest = async (req) => {
  try {
    const shows = await showModel.find({})
      .populate('movie_id', 'title poster')
      .populate('theatre_id', 'theatrename');
    
    console.log("Shows Array", shows);
    // Return success response
    return { statusCode: 200, body: shows };
  } catch (err) {
    console.log("Error fetching shows:", err);
    // Return error response
    return { statusCode: 500, body: { message: "Failed to fetch shows", error: err.message } };
  }
};

// Function for deleting a show
export const handleDeletion = async (id) => {
try {
    await showModel.findByIdAndDelete(id);
    return { statusCode: 200, body: { message: "Show deleted successfully" } };
} catch (error) {
    return { statusCode: 500, body: { message: "Failed to delete show", error } };
}
};
