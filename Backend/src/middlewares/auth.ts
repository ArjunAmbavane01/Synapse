import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config";
import mongoose from "mongoose";

interface TokenPayload {
  userId:mongoose.Schema.Types.ObjectId
}

declare global{
  namespace Express {
    interface Request{
      userId?:string
    }
  }
}


export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authoriztion");
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

      if(token){
        try{
            const payload = jwt.verify(token,JWT_SECRET) as TokenPayload;
            req.userId = payload.userId.toString();
            next();
        } catch(e:unknown){
            res.status(500).json({
                type: "error",
                msg: "Invalid or expired token",
                error: e
            })
            return
        }
      }
      else {
        res.status(401).json({
            type:"error",
            msg: "Token not present"
        })
        return
      }
};
