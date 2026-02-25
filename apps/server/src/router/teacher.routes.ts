import express from "express";
const router: express.Router = express.Router();
import {
    getAllTeachers,
    getTeacherById,
} from "../controller/teacher.controller.js";
import { onlyAdmin, protect } from "../middleware/index.js";


router.get("/", protect, onlyAdmin, getAllTeachers);
router.get("/:id", protect, onlyAdmin, getTeacherById);

export default router;