"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OverviewData {
  activeTeachers?: number;
  totalLessons?: number;
  totalAssessments?: number;
  totalQuizzes?: number;
}

interface WeeklyData {
  data?: Array<{ day: string; totalActivity: number }>;
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [weekly, setWeekly] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [overviewRes, weeklyRes] = await Promise.all([
          fetch("http://localhost:4000/api/insites/overview", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:4000/api/insites/weekly", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (overviewRes.status === 401 || overviewRes.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const overviewData = await overviewRes.json();
        const weeklyData = await weeklyRes.json();

        setOverview(overviewData);
        setWeekly(weeklyData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Companion</h1>
          <p className="text-gray-500 text-sm mt-1">See What&apos;s Happening Across your School</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Insights</h2>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f0f3f5] p-5 rounded-xl border-l-[6px] border-[#d3dce3]">
          <p className="text-sm font-medium text-gray-500 mb-1 flex justify-between">
            Active Teachers
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </p>
          <p className="text-3xl font-bold text-gray-900">{overview?.activeTeachers || 0}</p>
          <p className="text-xs text-gray-400 mt-2">This week</p>
        </div>
        
        <div className="bg-[#eefcf3] p-5 rounded-xl border-l-[6px] border-[#a5d8b8]">
          <p className="text-sm font-medium text-gray-500 mb-1 flex justify-between">
            Lessons Created
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </p>
          <p className="text-3xl font-bold text-gray-900">{overview?.totalLessons || 0}</p>
          <p className="text-xs text-gray-400 mt-2">This week</p>
        </div>
        
        <div className="bg-[#fff8ee] p-5 rounded-xl border-l-[6px] border-[#f4cda4]">
          <p className="text-sm font-medium text-gray-500 mb-1 flex justify-between">
            Assessments Made
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </p>
          <p className="text-3xl font-bold text-gray-900">{overview?.totalAssessments || 0}</p>
          <p className="text-xs text-gray-400 mt-2">This week</p>
        </div>
        
        <div className="bg-[#fff1f1] p-5 rounded-xl border-l-[6px] border-[#fac7c7]">
          <p className="text-sm font-medium text-gray-500 mb-1 flex justify-between">
            Quizzes Conducted
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </p>
          <p className="text-3xl font-bold text-gray-900">{overview?.totalQuizzes || 0}</p>
          <p className="text-xs text-gray-400 mt-2">This week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Chart (Simple Bar Visualization) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-1">Weekly Activity</h3>
          <p className="text-sm text-gray-500 mb-6">Content creation trends</p>
          
          <div className="h-64 flex items-end justify-between px-2">
            {weekly?.data?.map((day, i: number) => {
              const maxVal = Math.max(...(weekly?.data || []).map((d) => d.totalActivity));
              const heightPercentage = maxVal > 0 ? (day.totalActivity / maxVal) * 100 : 0;
              
              return (
                <div key={i} className="flex flex-col items-center w-full">
                  <div className="w-8 md:w-12 bg-green-200 rounded-t-sm relative group transition-all" style={{ height: `${heightPercentage}%`, minHeight: '4px' }}>
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                      {day.totalActivity} activities
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{day.day}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Pulse Summary (Static/Mocked for aesthetics since there's no real AI summary response specified) */}
        <div className="bg-[#fcfaf5] p-6 rounded-xl border border-[#f3e9d8]">
          <h3 className="text-md font-semibold text-gray-900 mb-1">AI Pulse Summary</h3>
          <p className="text-sm text-gray-500 mb-6">Real time insights from your data</p>
          
          <div className="space-y-4">
            <div className="bg-[#fdf0f5] p-3 rounded-lg flex items-start">
              <span className="text-pink-500 mr-3 mt-0.5">💡</span>
              <p className="text-sm text-gray-700">Highest workload detected with teachers managing more than 5 classes.</p>
            </div>
            <div className="bg-[#f0f9f5] p-3 rounded-lg flex items-start">
              <span className="text-green-500 mr-3 mt-0.5">📈</span>
              <p className="text-sm text-gray-700">Assessments creation grew by 15% comparing to last week&apos;s data.</p>
            </div>
            <div className="bg-[#fff9e6] p-3 rounded-lg flex items-start">
              <span className="text-yellow-500 mr-3 mt-0.5">⚠️</span>
              <p className="text-sm text-gray-700">Some teachers have logged 0 activity this current period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}