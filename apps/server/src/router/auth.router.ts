import { signinController, signupController } from "../controller/auth.controller.js";
import express from "express";

const router: express.Router = express.Router()

router.post('/signup', signupController)
router.post('/signin', signinController)
export default router