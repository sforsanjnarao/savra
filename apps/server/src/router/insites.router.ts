import express from "express";
import {
    getOverviewController,
    getWeeklyTrendController,
    getAiSummaryController,
} from "../controller/insite.controller";
import { protect } from "../middleware";

const router: express.Router = express.Router();

router.get("/overview", protect, getOverviewController);
router.get("/weekly", protect, getWeeklyTrendController);
router.get("/ai-summary", protect, getAiSummaryController);

export default router;