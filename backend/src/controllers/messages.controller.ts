import { Request,Response } from "express";
import prisma from "../db/prisma.js";

export const sendMessage = async(req:Request,res:Response)=>{
    try{
        const {message} = req.body
        const {id:recevierId} = req.params
        const senderId = req.user.id

        let conversation = await prisma.conversation.findFirst({
            where:{
                participantIds:{
                    hasEvery:[senderId,recevierId]      
                }
            }
        })

        if(!conversation){
            conversation = await prisma.conversation.create({
                data:{
                    participantIds:{
                        set:[senderId,recevierId]
                    }
                }
            })
        }

        const newMessage = await prisma.message.create({
            data:{
                senderId,
                body:message,
                conversationId:conversation.id
            }
        })

        if(newMessage){
            conversation = await prisma.conversation.update({
                where:{
                    id:conversation.id
                },
                data:{
                    messages:{
                        connect:{
                            id:newMessage.id
                        }
                    }
                }
            })
        }

        res.json(newMessage)
    }catch(error:any){
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const getMessage = async(req:Request,res:Response) =>{

    try{
        const {id:recevierId} = req.params
        const senderId = req.user.id

        const conversation = await prisma.conversation.findFirst({
            where:{
                participantIds:{
                    hasEvery:[recevierId,senderId]
                }
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt:'asc'
                    }
                }
            }
        })

        if(!conversation){
            return res.status(200).json("No conversation b/w users")
        }

        res.status(200).json(conversation.messages)
    }catch(error:any){
        res.status(500).json({error:error.message})
    }
   
}

export const getUser = async(req:Request, res:Response)=>{
    try{
        const myId = req.user.id
        
        const users = await prisma.user.findMany({
            where:{
                id:{
                    not:myId
                }
            },
            select:{
                id:true,
                fullName:true,
                profilePic:true
            }
        })

        res.status(200).json(users)
    }catch(error:any){
        res.status(500).json({error:'Internal Server Error'})
    }
}