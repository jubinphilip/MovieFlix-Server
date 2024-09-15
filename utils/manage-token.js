import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import {jwtDecode} from 'jwt-decode';

//function which creates token role is passed from each function call 
export const createToken=(user,role)=>{
    console.log(user[0],role)//role determines whethr user or admin is logged in
    const payload={
        id:user[0]._id,
        email:user[0].email,
        role:role
    };
    const secret=process.env.JWT_SECRET;
    console.log(secret)
    const options={
        expiresIn:'1h'
    };
    return jwt.sign(payload,secret,options)
}
export const decodeToken=(credential)=>
{
    const decoded=jwtDecode(credential)
    return decoded
}

