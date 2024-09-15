import mongoose from 'mongoose'
import dotenv from 'dotenv';


dotenv.config();
export async function main()
 {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to MongoDB')
}
