import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_USER_SECRET } from "./config.js";

export const auth = (req : Request,res : Response,next: NextFunction) => {
    const token = req.headers.token;
    try{
        const decodedInfo = jwt.verify(token as string,JWT_USER_SECRET as string);
        if(decodedInfo as jwt.JwtPayload){
            // @ts-ignore
            req.userId = decodedInfo.userId;
            next();
        }
    } catch(err){
        console.error(err);
        return res.json({
            message: "Error while authentication"
        })
    }
}