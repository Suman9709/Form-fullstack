import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import Dbconnection from "./Database/Dbconnection.js"
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    // credentials: true,

    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow the necessary methods
    credentials: true, // Allow cookies (important for JWTs)
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRouter from "./Routes/user.route.js"
app.use('/users', userRouter)

Dbconnection()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server is listening on ${process.env.PORT}`);

        })
    }).catch((err) => {
        console.log("MongoDb connection error", err);

    })