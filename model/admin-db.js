import mongoose from "mongoose"

const adminSchema=new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String}
})
export const adminModel=new mongoose.model('admin',adminSchema)

const movieSchema=new mongoose.Schema({
    title:String,
    description:String,
    language:String,
    genre:String,
    rating:String,
    poster:String,
    summary:String,
    duration:String,
    cast:{
        actor:String,
        actor_image:String,
        actress:String,
        actress_image:String,
        director:String,
        production:String
    }
}, { timestamps: true } )
export const movieModel=new mongoose.model('movies',movieSchema)
const theatreSchema=new mongoose.Schema({
    theatrename:String,
    theatreloc:String,
    ticketprice:String,
    seats:String,
    movies:{
        movie1:{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' },
        movie2:{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' },
        movie3:{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' },
    }
}, { timestamps: true } )
export const theatreModel=new mongoose.model('theatres',theatreSchema)

const showSchema=new mongoose.Schema({
    theatre_id:{type:mongoose.Schema.Types.ObjectId,ref:"theatres"},
    seats:String,
    remaining_seats:String,
    movie_id:{type:mongoose.Schema.Types.ObjectId,ref:"movies"},
    from_date:Date,
    to_date:Date,
    timing:String
}, { timestamps: true } )

 export const showModel=new mongoose.model('shows',showSchema)
