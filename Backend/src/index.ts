import express from 'express';
import mongoose from 'mongoose';    

import { connectDB } from './db';
import userRouter from './routes/userRoutes';

connectDB();

const app = express();
const PORT = 3000

app.use(express.json());

app.use('/user',userRouter)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})