import mongoose from "mongoose";

const dbconnection = async()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName:"FullStackForm",
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(()=>{
        console.log("DataBase is connected successfully ");
    }).catch(error=>{
        console.log(`database connection error ${error}`); 
    });
}
export default dbconnection;