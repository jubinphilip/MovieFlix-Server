import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
dotenv.config();

const corsOptions = {
    origin: 'https://movieflix-bay-five.vercel.app', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import router from './router/admin-routes.js';
import userrouter from './router/user-routes.js';


app.use('/uploads', express.static('uploads'));
app.use('/user', userrouter);
app.use('/admin', router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
