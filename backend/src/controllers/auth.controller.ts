import { Request,Response } from "express";
import prisma from "../db/prisma.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import generateToken from "../utils/generateToken.js";

export const signup = async(req:Request,res:Response)=>{
try{
    const {fullName,username,password,confirmPassword, gender} = req.body()    
    
    if(!fullName || !username || !password || !confirmPassword || !gender){
        return res.status(400).json({error:'please fill in all fields'})
    }

    if(password !== confirmPassword){
        return res.status(400).json({error: "Password don't match"})
    }

    const existUser = await prisma.user.findUnique({where: {username}})

    if(existUser){
        return res.status(400).json({error:"Username already exist"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
    
    const newUser =await prisma.user.create({
        data:{
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic:gender ==="male"? boyProfilePic : girlProfilePic

        }
    })

    if(newUser){
        generateToken(newUser.id,res)

        res.status(201).json({
            if:newUser.id,
            fullName:newUser.fullName,
            username:newUser.username,
            profilePic:newUser.profilePic
        })
    }else{
        res.status(400).json({error: 'Invalid user data'})
    }
    
}catch(error:any){
    console.log(error.message)
    res.status(500).json({error: "Internal Server Error"})
}
}

export const login = (req:Request,res:Response)=>{
    res.send('Heeelo')
}
export const logout = (req:Request,res:Response)=>{
    res.send('Heeelo')
}