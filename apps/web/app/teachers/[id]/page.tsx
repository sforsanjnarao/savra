"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Activity {
  title?: string;
  type?: string;
  date: string;
  class: string;
}

interface TeacherDetailData {
  teacher?: {
    name: string;
    subjects: string[];
    classes: string[];
  };
  metrics?: {
    lessons: number;
    quizzes: number;
    assessments: number;
    lowEngagement: string;
  };
  recentActivity?: Activity[];
}

export default function TeacherDetailPage() {
  const [data, setData] = useState<TeacherDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchTeacherDetail = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/api/teachers/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const teacherData = await res.json();
        setData(teacherData);
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTeacherDetail();
    }
  }, [router, params.id]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading teacher details...</div>;
  }

  if (!data) {
    return <div className="p-8 text-red-500">Failed to load teacher data.</div>;
  }

  const teacher = data.teacher || { name: "Unknown", subjects: [], classes: [] };
  const metrics = data.metrics || { lessons: 0, quizzes: 0, assessments: 0, lowEngagement: "0%" };
  const recentActivity = data.recentActivity || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/teachers" className="text-sm text-blue-600 hover:text-blue-800 flex items-center mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Teachers
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {teacher.name?.charAt(0) || "?"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{teacher.name || "Unknown Teacher"}</h1>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold text-gray-700">Subjects:</span> {teacher.subjects?.join(", ") || "N/A"} 
              <span className="mx-2">|</span> 
              <span className="font-semibold text-gray-700">Grade Taught:</span> {teacher.classes?.join(", ") || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#fff1f1] p-5 rounded-xl border border-[#fac7c7]">
          <p className="text-sm font-medium text-gray-500 mb-1">Lessons Created</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.lessons}</p>
        </div>
        
        <div className="bg-[#eefcf3] p-5 rounded-xl border border-[#a5d8b8]">
          <p className="text-sm font-medium text-gray-500 mb-1">Quizzes Conducted</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.quizzes}</p>
        </div>
        
        <div className="bg-[#fff8ee] p-5 rounded-xl border border-[#f4cda4]">
          <p className="text-sm font-medium text-gray-500 mb-1">Assessments Assigned</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.assessments}</p>
        </div>
        
        <div className="bg-[#fcfaf5] p-5 rounded-xl border border-[#f3e9d8]">
          <p className="text-sm font-medium text-gray-500 mb-1 text-orange-500">Low Engagement Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-2 flex items-baseline">
            {metrics.lowEngagement} <span className="text-xs text-gray-500 font-normal ml-2 tracking-wide">Avg based on 10% consider reviewing teaching methods</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-1">Class-wise Breakdown</h3>
          <div className="flex items-center space-x-4 mb-6 mt-1">
            <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Avg Trend</span>
            <span className="flex items-center text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Comparison</span>
          </div>
          
          <div className="h-64 flex items-end justify-around border-b border-l border-gray-100 px-4 pt-4 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-400 -ml-6 py-2">
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>
            
            {teacher.classes?.map((c: string, idx: number) => {
              const height1 = 20 + ((idx * 17) % 60);
              const height2 = 20 + (((idx + 3) * 23) % 60);
              
              return (
                <div key={idx} className="flex flex-col items-center z-10 w-full group">
                  <div className="flex space-x-1 items-end h-[150px] w-full justify-center">
                    <div className="w-4 md:w-8 bg-blue-400 rounded-t-sm" style={{ height: `${height1}%` }}></div>
                    <div className="w-4 md:w-8 bg-green-400 rounded-t-sm" style={{ height: `${height2}%` }}></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 font-medium">{c}</div>
                </div>
              );
            }) || <div className="text-gray-400 flex items-center h-full">No class data available</div>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Activity</h3>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx: number) => (
                <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                  <p className="text-sm font-medium text-gray-800">{activity.title || activity.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleDateString()} - {activity.class}</p>
                </div>
              ))
            ) : (
              <div className="bg-[#fcfaf5] p-6 rounded-lg text-center flex flex-col items-center justify-center">
                <span className="text-2xl mb-2">📄</span>
                <p className="text-sm font-medium text-gray-700">No Recent Activity</p>
                <p className="text-xs text-gray-500 mt-1">No quizzes or assignments created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
