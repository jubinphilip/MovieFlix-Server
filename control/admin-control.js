
import { main } from '../model/db-connect.js';
main().catch(err => console.error('Database connection error:', err))//main is the function for connecting with database
import {movieModel,theatreModel,showModel, adminModel} from '../model/admin-db.js'
import { createToken } from '../utils/manage-token.js';
import {handleDeletion,handleNewMovie} from '../Repo/admin-repo.js'


//Function for admin login
export const adminLogin = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    try {
      const data = await adminModel.find({ email: email, password: password });
  
      if (data.length > 0) {
        const token=createToken(data,'admin')

        res.status(200).json({message:"Loginned",token:token});
      } else {
        res.status(400).json({message:"Login failed"});
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  //Function for adding new movies 
export const addMovies=async (req,res)=>{
   handleNewMovie(req,res)
}

//function for getting movies
export const getMovies=async(req,res)=>{
    const movies=await movieModel.find({}).then((data)=>{
        res.json(data)
    })
}

//function for adding theatre
export const addTheatre=async(req,res)=>{
    const{theatrename,theatreloc,ticketprice,seats,movie1,movie2,movie3}=req.body
    console.log(req.body)
    //creating model for theatre
    await theatreModel.create({
       theatrename,
       theatreloc,
       ticketprice,
       seats,
       movies:{
        movie1,
        movie2,
        movie3
       }
    })
    res.status(200).json({message:"Data inserted"})
}

//function for getting the theatre list
export const getTheatre=async(req,res)=>{
    const movies=await theatreModel.find({}).then((data)=>{
        res.json(data)
    })
}

//Function for editing the movies
export const editMovies=async(req,res)=>{
    const{theatrename,movie1,movie2,movie3}=req.body
    const theatre=theatreModel.find({theatrename})
    //finding the theatre with theatre name and then updating movies
    const updatedTheatre = await theatreModel.findOneAndUpdate(
        { theatrename }, // Query condition to find the theater by name
        { $set: { 'movies.movie1': movie1, 'movies.movie2': movie2, 'movies.movie3': movie3 } }, // Update operation
        { new: true, useFindAndModify: false } // Options: return the updated document
      );
}

//function for selecting the theatre and its running movies
export const getSelectedMovies=async(req,res)=>{
    const{id}=req.params;
    console.log(id)
    const theatre = await theatreModel.findById(id).populate({
        path: 'movies.movie1 movies.movie2 movies.movie3',//Taking moviees frm moviemodel using id in the theatre model
        select: 'title'
    });
    console.log(theatre)
    if (theatre) {
        // Now theatre.movies contains full movie documents instead of just ObjectIds
        const movies = {
            movie1: theatre.movies.movie1 ? theatre.movies.movie1: null,
            movie2: theatre.movies.movie2 ? theatre.movies.movie2: null,
            movie3: theatre.movies.movie3 ? theatre.movies.movie3: null,
        };
        console.log(movies)
        res.status(200).json(movies)
    }
}

//Function for adding shows
export const addShows=async(req,res)=>
{
    const {movie_id,theatre_id,seats,timing,from_date,to_date}=req.body
    console.log(req.body)
    //creating model for shows
     showModel.create({
        theatre_id,
        seats,
        timing,
        from_date,
        to_date,
        movie_id
    })
    res.status(200).json({message:"Show Added"})
}


//function for displaying the shows to user
export const getShows=async(req,res)=>{
    try
    {
    const shows=await showModel.find({})
    .populate('movie_id','title poster')
    .populate('theatre_id','theatrename')
    console.log(shows)
    res.json(shows)
    }
    catch(err)
    {
        console.log(error)
    }
    
}

//function for deleting a movie
export const deleteShows=async(req,res)=>{
try{
    const id=req.params.id
    console.log(id)
    handleDeletion(id,res)
}
catch(error)
{
    console.log(error)
}
}
