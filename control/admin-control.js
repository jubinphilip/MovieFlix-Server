
import { main } from '../model/db-connect.js';
import { adminModel, movieModel,theatreModel } from '../model/admin-db.js';
main().catch(err => console.error('Database connection error:', err))//main is the function for connecting with database
import {handleDeletion,handleNewMovie,handleAdminLogin,handleTheatreAdd,handleMovieEdit,handleSelectedMovieRequest,handleShows,handleShowRequest} from '../Repo/admin-repo.js'
import bcrypt from 'bcrypt'
const saltRounds=10

export const createAdmin=async(req,res)=>
{
    const{email,password}=req.body
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.log("Error hashing password");
            return res.status(500).json({ message: "Error hashing password" });
        }
        try {
            await adminModel.create({
                email,
                password: hash//inserting hashed password to db
            })
            }catch(error)
            {
                console.log(error)
            }
    
})   }

//Function for admin login
export const adminLogin = async (req, res) => {
       await handleAdminLogin(req,res)
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
    await handleTheatreAdd(req,res)
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
  await handleMovieEdit(req,res)
}

//function for selecting the theatre and its running movies
export const getSelectedMovies=async(req,res)=>{
    const{id}=req.params;
    console.log(id)
    await handleSelectedMovieRequest(id,res)
}

//Function for adding shows
export const addShows=async(req,res)=>
{
    await handleShows(req,res)
}


//function for displaying the shows to user
export const getShows=async(req,res)=>{
   await handleShowRequest(req,res)
}

//function for deleting a movie
export const deleteShows=async(req,res)=>{
try{
    const id=req.params.id
    console.log(id)
  await  handleDeletion(id,res)
}
catch(error)
{
    console.log(error)
}
}
