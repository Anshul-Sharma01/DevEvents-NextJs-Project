import mongoose, { mongo } from "mongoose";

//  Define the connection cache type
type MongooseCache = {
    conn : typeof mongoose | null;
    promise : Promise < typeof mongoose > | null;
}


declare global {
    var mongoose : MongooseCache | undefined
}

const MONGODB_URL = process.env.MONGO_URI;

if(!MONGODB_URL){
    throw new Error(
        "Please define the MongoDB_URI Environment variable inside .env local"
    );
}

let cached : MongooseCache = global.mongoose || { conn : null, promise : null };

if(!global.mongoose){
    global.mongoose = cached;
}


async function connectDB() : Promise < typeof mongoose > {
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        const options = {
            bufferCommands : false,
        }

        cached.promise = mongoose.connect(MONGODB_URL!, options).then((mongoose) => {
            return mongoose;
        })
    }
    try{
        cached.conn = await cached.promise;
    }catch(err){
        cached.promise = null;
        throw err;
    }
    return cached.conn;
}

export default connectDB;
