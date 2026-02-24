
import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
export const signupController=async (req: Request, res: Response) => {
    const { email, password, role } = req.body
  
    const isUserExist=await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(isUserExist){
        return 
    }
    const hashedPassword= await bcrypt.hash(password,10)
    const createUser=await prisma.user.create({
        data:{
            email,
            password:hashedPassword,
            role
        }
    })
     const token= jwt.sign({userId:createUser.id, role:createUser.role},'sanjana')

    return res.status(201).json({
        createUser,
        token
    })

}

export const signinController=async (req:Request, res:Response)=>{
    const {email, password}=req.body
    //check if user exist or not
    const isUserExist=await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!isUserExist){
        return 
    }

    const comparePassword=await bcrypt.compare(password,isUserExist.password)
    if(!comparePassword){
        return  
    }
    const token= jwt.sign({userId:isUserExist.id, role:isUserExist.role},'sanjana')

    return res.status(200).json({
        isUserExist,
        token
    })
}




