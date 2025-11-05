import { Router } from "express";
import { client } from "../index.js";
import { auth } from "../authMiddleware.js";

export const todoRouter = Router()

todoRouter.post("/create", auth, async (req,res) => {
    const {title,description,done} = req.body;
    // @ts-ignore
    const userId = req.userId;
    try{
        await client.todo.create({
            data: {
                title,
                description,
                done,
                userId
            }
        })
        return res.json({
            message: "Todo added successfully"
        })
    } catch(err){
        console.error(err);
        return res.json({
            message: "Error while creating todo"
        })
    }
})

todoRouter.get("/fetch", auth, async (req,res) => {
    // @ts-ignore
    const userId = req.userId;
    try{
        const todos = await client.todo.findMany({
            where: {
                userId
            }
        })
        return res.json({
            todos
        });
    } catch(err){
        console.error(err);
        return res.json({
            message: "Error while fetching todo"
        })
    }
})