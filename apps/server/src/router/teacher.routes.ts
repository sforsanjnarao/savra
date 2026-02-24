import express from "express";
const router: express.Router = express.Router();
import {
    getAllTeachers,
    getTeacherById,
} from "../controller/teacher.controller";
import { onlyAdmin, protect } from "../middleware";


router.get("/",protect, onlyAdmin, getAllTeachers);
router.get("/:id",protect, onlyAdmin, getTeacherById);

export default router;