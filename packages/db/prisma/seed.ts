import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const teachers = [
    { id: "T001", name: "Anita Sharma" },
    { id: "T002", name: "Rahul Verma" },
    { id: "T003", name: "Pooja Mehta" },
    { id: "T004", name: "Vikas Nair" },
    { id: "T005", name: "Neha Kapoor" },
];

const activities = [
    { teacherId: "T004", activityType: "QUIZ", subject: "Social Studies", class: "10", createdAt: "2026-02-12 19:07:41" },
    { teacherId: "T003", activityType: "ASSESSMENT", subject: "English", class: "7", createdAt: "2026-02-13 15:31:51" },
    { teacherId: "T004", activityType: "LESSON", subject: "Social Studies", class: "10", createdAt: "2026-02-11 19:15:55" },
    { teacherId: "T001", activityType: "LESSON", subject: "Mathematics", class: "7", createdAt: "2026-02-17 20:35:33" },
    { teacherId: "T004", activityType: "ASSESSMENT", subject: "Social Studies", class: "9", createdAt: "2026-02-15 16:51:32" },
    { teacherId: "T003", activityType: "QUIZ", subject: "English", class: "6", createdAt: "2026-02-14 15:22:29" },
    { teacherId: "T005", activityType: "QUIZ", subject: "Mathematics", class: "10", createdAt: "2026-02-12 12:26:22" },
    { teacherId: "T002", activityType: "QUIZ", subject: "Science", class: "9", createdAt: "2026-02-17 09:21:32" },
    { teacherId: "T002", activityType: "ASSESSMENT", subject: "Science", class: "9", createdAt: "2026-02-12 11:38:24" },
    { teacherId: "T003", activityType: "ASSESSMENT", subject: "English", class: "6", createdAt: "2026-02-17 19:07:47" },
    { teacherId: "T005", activityType: "LESSON", subject: "Mathematics", class: "10", createdAt: "2026-02-11 17:53:57" },
    { teacherId: "T001", activityType: "ASSESSMENT", subject: "Mathematics", class: "8", createdAt: "2026-02-16 11:26:52" },
    { teacherId: "T003", activityType: "LESSON", subject: "English", class: "7", createdAt: "2026-02-16 15:41:50" },
    { teacherId: "T005", activityType: "ASSESSMENT", subject: "Mathematics", class: "10", createdAt: "2026-02-11 17:54:16" },
    { teacherId: "T001", activityType: "LESSON", subject: "Mathematics", class: "8", createdAt: "2026-02-17 19:19:56" },
    { teacherId: "T004", activityType: "QUIZ", subject: "Social Studies", class: "9", createdAt: "2026-02-16 19:12:33" },
    { teacherId: "T001", activityType: "ASSESSMENT", subject: "Mathematics", class: "8", createdAt: "2026-02-13 09:16:06" },
    { teacherId: "T003", activityType: "QUIZ", subject: "English", class: "6", createdAt: "2026-02-15 11:36:03" },
    { teacherId: "T004", activityType: "LESSON", subject: "Social Studies", class: "9", createdAt: "2026-02-11 13:06:29" },
    { teacherId: "T005", activityType: "QUIZ", subject: "Mathematics", class: "10", createdAt: "2026-02-15 13:31:42" },
    { teacherId: "T001", activityType: "ASSESSMENT", subject: "Mathematics", class: "8", createdAt: "2026-02-16 11:44:31" },
    { teacherId: "T001", activityType: "LESSON", subject: "Mathematics", class: "8", createdAt: "2026-02-18 18:45:43" },
    { teacherId: "T005", activityType: "ASSESSMENT", subject: "Mathematics", class: "10", createdAt: "2026-02-12 19:19:44" },
    { teacherId: "T002", activityType: "QUIZ", subject: "Science", class: "8", createdAt: "2026-02-14 13:57:07" },
    { teacherId: "T002", activityType: "ASSESSMENT", subject: "Science", class: "8", createdAt: "2026-02-12 18:01:59" },
    { teacherId: "T001", activityType: "ASSESSMENT", subject: "Mathematics", class: "7", createdAt: "2026-02-14 10:36:09" },
    { teacherId: "T001", activityType: "LESSON", subject: "Mathematics", class: "8", createdAt: "2026-02-18 16:32:47" },
    { teacherId: "T004", activityType: "QUIZ", subject: "Social Studies", class: "10", createdAt: "2026-02-15 15:59:00" },
    { teacherId: "T002", activityType: "LESSON", subject: "Science", class: "8", createdAt: "2026-02-15 13:31:36" },
    { teacherId: "T004", activityType: "LESSON", subject: "Social Studies", class: "9", createdAt: "2026-02-15 16:32:23" },
    { teacherId: "T003", activityType: "ASSESSMENT", subject: "English", class: "6", createdAt: "2026-02-18 09:12:05" },
    { teacherId: "T005", activityType: "LESSON", subject: "Mathematics", class: "9", createdAt: "2026-02-18 16:26:04" },
    { teacherId: "T005", activityType: "LESSON", subject: "Mathematics", class: "9", createdAt: "2026-02-16 17:14:47" },
    { teacherId: "T003", activityType: "ASSESSMENT", subject: "English", class: "6", createdAt: "2026-02-12 17:47:58" },
    { teacherId: "T005", activityType: "QUIZ", subject: "Mathematics", class: "10", createdAt: "2026-02-18 14:05:20" },
    { teacherId: "T002", activityType: "QUIZ", subject: "Science", class: "8", createdAt: "2026-02-14 09:54:01" },
    { teacherId: "T002", activityType: "LESSON", subject: "Science", class: "9", createdAt: "2026-02-12 18:27:09" },
    { teacherId: "T001", activityType: "QUIZ", subject: "Mathematics", class: "8", createdAt: "2026-02-14 15:43:38" },
    { teacherId: "T002", activityType: "LESSON", subject: "Science", class: "8", createdAt: "2026-02-18 15:48:08" },
    { teacherId: "T002", activityType: "LESSON", subject: "Science", class: "9", createdAt: "2026-02-18 13:31:34" },
    { teacherId: "T003", activityType: "LESSON", subject: "English", class: "6", createdAt: "2026-02-14 19:49:54" },
    { teacherId: "T005", activityType: "QUIZ", subject: "Mathematics", class: "10", createdAt: "2026-02-14 11:55:18" },
    { teacherId: "T003", activityType: "LESSON", subject: "English", class: "6", createdAt: "2026-02-16 15:33:27" },
    { teacherId: "T005", activityType: "LESSON", subject: "Mathematics", class: "9", createdAt: "2026-02-18 11:51:37" },
];

// Single admin login — as per the assignment (principal/admin view)
const users = [
    { email: "admin@savra.com", plainPassword: "admin123", role: "ADMIN" as const, teacherId: null },
];

async function main() {
    console.log("🌱 Seeding teachers...");
    for (const t of teachers) {
        await prisma.teacher.upsert({
            where: { id: t.id },
            update: { name: t.name },
            create: { id: t.id, name: t.name },
        });
    }
    console.log(`✅ ${teachers.length} teachers seeded.`);

    console.log("🌱 Seeding users (login accounts)...");
    for (const u of users) {
        const hashedPassword = await bcrypt.hash(u.plainPassword, 10);
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                password: hashedPassword,
                role: u.role,
            },
        });
        // Link the teacher record to this user account
        if (u.teacherId) {
            await prisma.teacher.update({
                where: { id: u.teacherId },
                data: { userId: user.id },
            });
        }
    }
    console.log(`✅ ${users.length} users seeded.`);

    console.log("🌱 Seeding activities...");
    let count = 0;
    for (const a of activities) {
        await prisma.activity.upsert({
            where: {
                teacherId_activityType_subject_class_createdAt: {
                    teacherId: a.teacherId,
                    activityType: a.activityType as any,
                    subject: a.subject,
                    class: a.class,
                    createdAt: new Date(a.createdAt),
                },
            },
            update: {},
            create: {
                teacherId: a.teacherId,
                activityType: a.activityType as any,
                subject: a.subject,
                class: a.class,
                createdAt: new Date(a.createdAt),
            },
        });
        count++;
    }
    console.log(`✅ ${count} activities seeded.`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
