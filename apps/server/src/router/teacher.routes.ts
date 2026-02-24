import express from "express";
const router: express.Router = express.Router();
import {
    getAllTeachers,
    getTeacherById,
} from "../controller/teacher.controller";


router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);

export default router;