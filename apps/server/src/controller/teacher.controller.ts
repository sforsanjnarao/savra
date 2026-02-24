import { Request, Response } from "express";
import { prisma } from "@repo/db";

// GET /teachers
export async function getAllTeachers(req: Request, res: Response) {
    try {
        const grouped = await prisma.activity.groupBy({
            by: ["teacherId", "activityType"],
            _count: { activityType: true },
            orderBy: { teacherId: "asc" },
        });

        // groupBy only returns scalar fields — fetch teacher names via the relation
        const teacherIds = [...new Set(grouped.map((r) => r.teacherId))];
        const nameRecords = await prisma.activity.findMany({
            where: { teacherId: { in: teacherIds } },
            select: { teacherId: true, teacher: { select: { name: true } } },
            distinct: ["teacherId"],
        });
        const nameMap = new Map(
            nameRecords.map((r) => [r.teacherId, r.teacher.name])
        );

        const teacherMap = new Map<
            string,
            {
                teacher_id: string;
                teacher_name: string;
                total: number;
                byType: Record<string, number>;
            }
        >();

        for (const row of grouped) {
            if (!teacherMap.has(row.teacherId)) {
                teacherMap.set(row.teacherId, {
                    teacher_id: row.teacherId,
                    teacher_name: nameMap.get(row.teacherId) ?? row.teacherId,
                    total: 0,
                    byType: {},
                });
            }

            const teacher = teacherMap.get(row.teacherId)!;
            teacher.byType[row.activityType] = row._count.activityType;
            teacher.total += row._count.activityType;
        }

        res.json(Array.from(teacherMap.values()));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
}

// GET /teachers/:id
export async function getTeacherById(req: Request, res: Response) {
    try {
        const teacherId = req.params.id as string;

        const activities = await prisma.activity.findMany({
            where: { teacherId },
            include: { teacher: true },
            // orderBy: { createdAt: "desc" },
        });

        if (activities.length === 0) {
            res.status(404).json({ error: "Teacher not found" });
            return;
        }

        const byType: Record<string, number> = {};
        const subjects = new Set<string>();
        const classes = new Set<string>();

        for (const a of activities) {
            byType[a.activityType] = (byType[a.activityType] ?? 0) + 1;
            subjects.add(a.subject);
            classes.add(a.class);
        }

        res.json({
            teacher_id: activities[0]?.teacherId,
            teacher_name: activities[0]?.teacher.name,
            total: activities.length,
            byType,
            subjects: Array.from(subjects).sort(),
            classes: Array.from(classes).sort(),
            recentActivity: activities.slice(0, 5),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch teacher" });
    }
}