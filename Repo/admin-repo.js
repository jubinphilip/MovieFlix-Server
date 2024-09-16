
import { createToken } from '../utils/manage-token.js';
import {movieModel,theatreModel,showModel, adminModel} from '../model/admin-db.js'

//Function for logging in admin

export const handleAdminLogin=async(req,res)=>
{
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
}

//Function for handling deletion of a show from database
export const handleDeletion = async (id, res) => {
    try {
        const deletedShow = await showModel.findByIdAndDelete(id);
        
        if (!deletedShow) {
            return res.status(404).json({ message: 'Show not found' });
        }
        
        res.status(200).json({ message: 'Show deleted successfully', deletedShow });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete the show', error });
    }
}

//Funcion for adding new movie to the database
export const handleNewMovie=async(req,res)=>{
  const{title,description,language,genre,rating,summary,actor,actress,director,production}=req.body;
    //poster actor_image ,actress_image are the 3 images uploaded bu client their name is stored in db
  const poster = req.files['poster'] ? req.files['poster'][0].filename : null;
const actor_image = req.files['actor_image'] ? req.files['actor_image'][0].filename : null;
const actress_image = req.files['actress_image'] ? req.files['actress_image'][0].filename : null;
console.log(poster,actor_image,actress_image)
try{

  //creating the movie model
  await movieModel.create({
      title,
      description,
      language,
      genre,
      rating,
      poster,
      summary,
      cast:{
          actor,
          actor_image,
          actress,
          actress_image,
          director,
          production
      }
  })
  res.status(200).json({message:"Movie Updated"})
    
}
catch(error){
  res.status(500).json({message:"Failed to add movie",error})
}
}

//Function for adding new theatre
export const handleTheatreAdd=async(req,res)=>
{
  const{theatrename,theatreloc,ticketprice,seats,movie1,movie2,movie3}=req.body
  console.log(req.body)
  try
  {
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
  res.status(200).json({message:"New theatre added"})
}
catch(error)
{
  res.status(400).json({message:"Unable to Insert Theatre"})
}
}
export const handleMovieEdit=async(req,res)=>
{
  const{theatrename,movie1,movie2,movie3}=req.body
  const theatre=theatreModel.find({theatrename})
  //finding the theatre with theatre name and then updating movies
  try
  {
  const updatedTheatre = await theatreModel.findOneAndUpdate(
      { theatrename }, // Query condition to find the theater by name
      { $set: { 'movies.movie1': movie1, 'movies.movie2': movie2, 'movies.movie3': movie3 } }, // Update operation
      { new: true, useFindAndModify: false } // Options: return the updated document
    );
    res.status(200).json({message:"Data Edited"})
  }
  catch(error)
  {
      res.status(500).json({message:"Error Occured"})
  }
}


//Funcion for getting selected movie list

export const handleSelectedMovieRequest=async (id,res)=>
{
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

//function for adding shows
export const handleShows=(req,res)=>
{
  const {movie_id,theatre_id,seats,timing,from_date,to_date}=req.body
  console.log(req.body)
  //creating model for shows
  try
  {
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
catch(error)
{
  res.status(500).json({message:"An error Occured"})
}
}

//Function for getting shows
export const handleShowRequest=async(req,res)=>{
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