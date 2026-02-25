// Typed API client — uses Bearer token from localStorage

export interface OverviewResponse {
    total: number;
    byType: Record<string, number>;
}

export interface Teacher {
    teacher_id: string;
    teacher_name: string;
    total: number;
    byType: Record<string, number>;
}

export interface TeacherDetail {
    teacher_id: string;
    teacher_name: string;
    total: number;
    byType: Record<string, number>;
    subjects: string[];
    classes: string[];
    recentActivity: Array<{
        id: string;
        activityType: string;
        subject: string;
        class: string;
        createdAt: string;
    }>;
}

export interface WeeklyData {
    week: string;
    [key: string]: string | number;
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function getToken(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") ?? "";
}

async function apiFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json() as Promise<T>;
}

export const api = {
    overview: () => apiFetch<OverviewResponse>("/api/insites/overview"),
    teachers: () => apiFetch<Teacher[]>("/api/teachers"),
    teacher: (id: string) => apiFetch<TeacherDetail>(`/api/teachers/${id}`),
    weekly: (teacherId?: string) =>
        apiFetch<WeeklyData[]>(`/api/insites/weekly${teacherId ? `?teacherId=${teacherId}` : ""}`),
    aiSummary: () => apiFetch<{ summary: string }>("/api/insites/ai-summary"),
};
