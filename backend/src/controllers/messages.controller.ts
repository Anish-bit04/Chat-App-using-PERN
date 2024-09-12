import { Request,Response } from "express";

export const conversations = (req:Request,res:Response)=>{
    res.send('Hello fropm conv')
}