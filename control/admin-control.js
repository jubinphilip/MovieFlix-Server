
import { main } from '../model/db-connect.js';
import { movieModel,theatreModel } from '../model/admin-db.js';
main().catch(err => console.error('Database connection error:', err))//main is the function for connecting with database
import {handleDeletion,handleNewMovie,handleAdminLogin,handleTheatreAdd,handleMovieEdit,handleSelectedMovieRequest,handleShows,handleShowRequest} from '../Repo/admin-repo.js'


//Function for admin login
export const adminLogin = async (req, res) => {
        handleAdminLogin(req,res)
  };
  
  //Function for adding new movies 
export const addMovies=async (req,res)=>{
   handleNewMovie(req,res)
}

//function for getting movies
export const getMovies=async(req,res)=>{
    try{
    const movies=await movieModel.find({}).then((data)=>{
        res.status(200).json(data)
        
    })
}
catch(err)
{
    console.log(err)
}
}

//function for adding theatre
export const addTheatre=async(req,res)=>{
    handleTheatreAdd(req,res)
}

//function for getting the theatre list
export const getTheatre=async(req,res)=>{
    try
    {
    const movies=await theatreModel.find({}).then((data)=>{
        res.json(data)
    })
}
catch(error)
{
    console.log(error)
}
}

//Function for editing the movies
export const editMovies=async(req,res)=>{
   handleMovieEdit(req,res)
}

//function for selecting the theatre and its running movies
export const getSelectedMovies=async(req,res)=>{
    const{id}=req.params;
    console.log(id)
    handleSelectedMovieRequest(id,res)
}

//Function for adding shows
export const addShows=async(req,res)=>
{
   handleShows(req,res)
}


//function for displaying the shows to user
export const getShows=async(req,res)=>{
   handleShowRequest(req,res)
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
