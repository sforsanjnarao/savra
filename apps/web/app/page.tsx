"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type OverviewResponse, type Teacher, type WeeklyData } from "../lib/api";
import WeeklyChart from "../components/WeeklyChart";
import AIInsightPanel from "../components/AIInsightPanel";

export default function DashboardPage() {
  const [overview, setOverview]   = useState<OverviewResponse | null>(null);
  const [weekly,   setWeekly]     = useState<WeeklyData[]>([]);
  const [teachers, setTeachers]   = useState<Teacher[]>([]);
  const [summary,  setSummary]    = useState("");
  const [loading,  setLoading]    = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const fetchAll = async () => {
      try {
        const [ov, tList, wk] = await Promise.all([
          api.overview(),
          api.teachers(),
          api.weekly(),
        ]);
        setOverview(ov);
        setTeachers(tList);
        setWeekly(wk);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }

      // Fetch AI summary separately (can be slow)
      try {
        const ai = await api.aiSummary();
        setSummary(ai.summary);
      } catch (err) {
        console.error("AI summary error:", err);
        setSummary("Unable to generate AI summary at this time.");
      } finally {
        setAiLoading(false);
      }
    };

    fetchAll();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  const totalLessons     = overview?.byType?.LESSON     ?? 0;
  const totalQuizzes     = overview?.byType?.QUIZ        ?? 0;
  const totalAssessments = overview?.byType?.ASSESSMENT  ?? 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Companion</h1>
        <p className="text-gray-500 text-sm mt-1">See What&apos;s Happening Across your School</p>
      </div>

      {/* Overview Cards */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Activities",  value: overview?.total ?? 0, bg: "bg-[#f0f3f5]", border: "border-[#d3dce3]" },
          { label: "Lessons Created",   value: totalLessons,          bg: "bg-[#eefcf3]", border: "border-[#a5d8b8]" },
          { label: "Assessments Made",  value: totalAssessments,       bg: "bg-[#fff8ee]", border: "border-[#f4cda4]" },
          { label: "Quizzes Conducted", value: totalQuizzes,           bg: "bg-[#fff1f1]", border: "border-[#fac7c7]" },
        ].map(({ label, value, bg, border }) => (
          <div key={label} className={`${bg} p-5 rounded-xl border-l-[6px] ${border}`}>
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-2">All time</p>
          </div>
        ))}
      </div>

      {/* Chart + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <h3 className="text-md font-semibold text-gray-900 mb-3">Weekly Activity Trend</h3>
          <WeeklyChart data={weekly} />
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-3">AI Pulse Summary</h3>
          <AIInsightPanel summary={summary} loading={aiLoading} />
        </div>
      </div>

      {/* All Teachers */}
      {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">All Teachers</h3>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#f0f3f5]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quizzes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((t) => (
              <tr key={t.teacher_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                      {t.teacher_name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{t.teacher_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{t.byType?.LESSON ?? 0}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{t.byType?.QUIZ ?? 0}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{t.byType?.ASSESSMENT ?? 0}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t.total}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <a href={`/teachers/${t.teacher_id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                    View Insights →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}