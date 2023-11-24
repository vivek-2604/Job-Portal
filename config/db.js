import mongoose from "mongoose";

const connectDB = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL)
        if(connect)
        console.log("connected database");
        else
        console.log("error in coonecting database");
    }catch(err){
        console.log("MongoDb Error:",err);
    }
}

export default connectDB;