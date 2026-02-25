import express from "express";
import {
    getOverviewController,
    getWeeklyTrendController,
    getAiSummaryController,
} from "../controller/insite.controller.js";
import { onlyAdmin, protect } from "../middleware/index.js";

const router: express.Router = express.Router();

router.get("/overview", protect, onlyAdmin, getOverviewController);
router.get("/weekly", protect, onlyAdmin, getWeeklyTrendController);
router.get("/ai-summary", protect, onlyAdmin, getAiSummaryController);

export default router;