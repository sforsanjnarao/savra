import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function protect(req:Request, res:Response, next:NextFunction){
    const authHeaders=req.headers.authorization
    if(!authHeaders || !authHeaders.startsWith('Bearer ')){
        return
    }
    const token=authHeaders.split(' ')[1]
    if(!token){
        return
    }
    const decode=jwt.verify(token, 'sanjana') as {userId:string, role:"ADMIN" | "TEACHER"}
    req.user={
        userId:decode.userId,
        role:decode.role
    }
    next()
}



export async function onlyTeacher(req:Request, res:Response, next:NextFunction){
    const {role}=req.user
    if (role !== "TEACHER") {
        return res.status(403).json(
            {
                "success": false,
                "error": "Forbidden, teacher access required"
            }
        )
    }
    next()
}

export async function onlyAdmin(req:Request, res:Response, next:NextFunction){
    const {role}=req.user
    if (role !== "ADMIN") {
        return res.status(403).json(
            {
                "success": false,
                "error": "Forbidden, teacher access required"
            }
        )
    }
    next()
}