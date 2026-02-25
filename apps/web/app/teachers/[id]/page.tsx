"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api, type TeacherDetail, type WeeklyData } from "../../../lib/api";
import WeeklyChart from "../../../components/WeeklyChart";
import AIInsightPanel from "../../../components/AIInsightPanel";

export default function TeacherDetailPage() {
  const [data,      setData]      = useState<TeacherDetail | null>(null);
  const [weekly,    setWeekly]    = useState<WeeklyData[]>([]);
  const [summary,   setSummary]   = useState("");
  const [loading,   setLoading]     = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const fetchAll = async () => {
      try {
        const [teacherData, weeklyData] = await Promise.all([
          api.teacher(id),
          api.weekly(id),
        ]);
        setData(teacherData);
        setWeekly(weeklyData);
      } catch (err) {
        console.error("Teacher detail fetch error:", err);
      } finally {
        setLoading(false);
      }

      try {
        const ai = await api.aiSummary();
        setSummary(ai.summary);
      } catch {
        setSummary("Unable to generate AI summary at this time.");
      } finally {
        setAiLoading(false);
      }
    };

    if (id) fetchAll();
  }, [router, id]);

  if (loading) return <div className="p-8 text-gray-500">Loading teacher details...</div>;
  if (!data)   return <div className="p-8 text-red-500">Teacher not found.</div>;

  const lessons     = data.byType?.LESSON     ?? 0;
  const quizzes     = data.byType?.QUIZ        ?? 0;
  const assessments = data.byType?.ASSESSMENT  ?? 0;

  const activityTypeLabel: Record<string, string> = {
    LESSON: "Lesson Plan", QUIZ: "Quiz", ASSESSMENT: "Question Paper",
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back + Header */}
      <div className="mb-6">
        <Link href="/teachers" className="text-sm text-blue-600 hover:text-blue-800 flex items-center mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Teachers
        </Link>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {data.teacher_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.teacher_name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold text-gray-700">Subjects:</span> {data.subjects.join(", ") || "N/A"}
              <span className="mx-2">|</span>
              <span className="font-semibold text-gray-700">Grades:</span> {data.classes.join(", ") || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Lessons Created",      value: lessons,     bg: "bg-[#eefcf3]", border: "border-[#a5d8b8]" },
          { label: "Quizzes Conducted",    value: quizzes,     bg: "bg-[#fff1f1]", border: "border-[#fac7c7]" },
          { label: "Assessments Assigned", value: assessments, bg: "bg-[#fff8ee]", border: "border-[#f4cda4]" },
        ].map(({ label, value, bg, border }) => (
          <div key={label} className={`${bg} p-5 rounded-xl border ${border}`}>
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Subjects + Classes tags */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Subjects Taught</h4>
          <div className="flex flex-wrap gap-2">
            {data.subjects.map((s) => (
              <span key={s} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Grades</h4>
          <div className="flex flex-wrap gap-2">
            {data.classes.map((c) => (
              <span key={c} className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Grade {c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Chart + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h3 className="text-md font-semibold text-gray-900 mb-3">Weekly Activity Pattern</h3>
          <WeeklyChart data={weekly} />
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-3">AI Pulse Summary</h3>
          <AIInsightPanel summary={summary} loading={aiLoading} />
        </div>
      </div>

      {/* Recent Activity */}
      {data.recentActivity.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {data.recentActivity.map((a) => (
              <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start text-sm">
                <div>
                  <p className="font-medium text-gray-900">{activityTypeLabel[a.activityType] ?? a.activityType}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{a.subject} · Grade {a.class}</p>
                </div>
                <p className="text-gray-400 text-xs">
                  {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
