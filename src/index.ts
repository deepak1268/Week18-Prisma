import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from "./generated/client/client.js";
import express from "express";
import { userRouter } from "./routes/user.js";
import { todoRouter } from "./routes/todo.js";


const app = express();
app.use(express.json())
export const client = new PrismaClient();

app.use("/api/v1/user",userRouter)
app.use("/api/v1/todo",todoRouter)

app.listen(3000,()=>{
    console.log("listening on port 3000")
})