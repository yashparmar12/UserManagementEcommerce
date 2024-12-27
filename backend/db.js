import mongoose from 'mongoose';


const db = async() =>{
    try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log("MongoDB connected successfuly");
    } catch (error) {
        console.log(error,'error');
    }
}

export default db;