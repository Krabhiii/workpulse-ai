import mongoose from "mongoose";
const connectDb = async()=>{
    try {
        await
        mongoose.connect(process.env.MONGODB_URL);
        console.log("database connected");
    } catch (error) {
        console.log("connection error :",error.message);
    }
}
export default connectDb;