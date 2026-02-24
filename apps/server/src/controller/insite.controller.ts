import { Request, Response } from "express";
import { prisma } from "@repo/db";


export async function getOverview() {
    const grouped = await prisma.activity.groupBy({
        by: ["activityType"],
        _count: { activityType: true },
    });

    const counts: Record<string, number> = {};
    for (const row of grouped) {
        counts[row.activityType] = row._count.activityType;
    }

    return {
        total: grouped.reduce((sum, r) => sum + r._count.activityType, 0),
        byType: counts,
    };
}

export async function getOverviewController(req: Request, res: Response) {
    try {
        const data = await getOverview();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch overview" });
    }
}


export async function getWeeklyTrend(teacherId?: string) {
    const activities = await prisma.activity.findMany({
        where: teacherId ? { teacherId } : undefined,
        select: { activityType: true, createdAt: true },
        orderBy: { createdAt: "asc" },
    });

    const weekMap = new Map<string, Record<string, number>>();

    for (const a of activities) {
        const week = getISOWeekLabel(a.createdAt);
        if (!weekMap.has(week)) weekMap.set(week, {});
        const types = weekMap.get(week)!;
        types[a.activityType] = (types[a.activityType] ?? 0) + 1;
    }

    return Array.from(weekMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([week, types]) => ({ week, ...types }));
}

export async function getWeeklyTrendController(req: Request, res: Response) {
    try {
        const teacherId =
            typeof req.query.teacherId === "string" ? req.query.teacherId : undefined;
        const data = await getWeeklyTrend(teacherId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch weekly trend" });
    }
}


export async function getSummaryData() {
    const rows = await prisma.activity.groupBy({
        by: ["teacherId", "activityType"],
        _count: { activityType: true },
        orderBy: { teacherId: "asc" },
    });
    return rows as { teacherId: string; activityType: string; _count: { activityType: number } }[];
}

export async function generateSummary(): Promise<string> {
    const rows = await getSummaryData();

    // Group by teacher
    const teacherMap = new Map<string, Record<string, number>>();
    for (const row of rows) {
        if (!teacherMap.has(row.teacherId)) teacherMap.set(row.teacherId, {});
        teacherMap.get(row.teacherId)![row.activityType] = row._count.activityType;
    }

    const lines: string[] = ["Teacher Activity Summary:"];
    for (const [teacherId, types] of teacherMap.entries()) {
        const breakdown = Object.entries(types)
            .map(([type, count]) => `${count} ${type.toLowerCase()}(s)`)
            .join(", ");
        lines.push(`- Teacher ${teacherId}: ${breakdown}`);
    }

    return lines.join("\n");
}

export async function getAiSummaryController(req: Request, res: Response) {
    try {
        const summary = await generateSummary();
        res.json({ summary });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate AI summary" });
    }
}

//healper
function getISOWeekLabel(date: Date): string {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
        ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}