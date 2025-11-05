import { Router } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import { client } from "../index.js";
import { JWT_USER_SECRET } from "../config.js";

export const userRouter = Router();
userRouter.post("/signup", async (req,res) => {
    // input validation
    const requiredBody = z.object({
    username: z
      .string()
      .min(6, { message: "Username must be atleast 6 characters." })
      .max(15, { message: "Username cannot be more than 15 characters." }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" })
      .max(20, { message: "Password cannot be more than 20 characters." })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Password must contain at least one digit.",
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "Password must contain at least one special letter.",
      }),
    age: z.number()
  });

  const result = requiredBody.safeParse(req.body);
  if (!result.success) {
    return res.status(411).send(result.error);
  }

    const {username,password,age} = req.body;
    try{
        const user = await client.user.create({
            data: {
                username,
                password,
                age
            }
        });
        return res.json({
            message: "Successfully signed up"
        })
    } catch(err){
        console.error(err);
        return res.json({
            message: "Error while signing up"
        })
    }
})

userRouter.post("/signin",async (req,res) => {
    const {username,password} = req.body;
    try{
        const user = await client.user.findFirst({
            where: {
                username,
                password
            }
        });
        console.log(JWT_USER_SECRET);
        if(user){
            const token = jwt.sign({
                userId: user.id
            },JWT_USER_SECRET as string)
            return res.json({
                token
            });
        } else {
            return res.json({
                message: "Invalid Credentials"
            })
        }
    } catch(err){
        console.error(err);
        return res.json({
            message: 'Error while signing in'
        })
    }
})