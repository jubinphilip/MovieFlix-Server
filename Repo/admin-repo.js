import { showModel,movieModel } from "../model/admin-db.js"

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