import { signinController, signupController } from "../controller/auth.controller";
import express from "express";

const router:express.Router=express.Router()

router.post('/signup', signupController)
router.post('/signin',signinController)