import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

configDotenv();
const dbString = process.env.MONGOSTR



const mongoconnect = async () => {
    try {
         await mongoose.connect(dbString);
        console.log("Database Conected");
    } catch (error) {
        console.log({
            message:"error while connecting to db",
            errorMessage:error.message
        })
    }
}

export default mongoconnect;