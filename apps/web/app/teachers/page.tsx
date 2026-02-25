"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Teacher {
  id: string;
  name: string;
  email: string;
  classes: string[];
  subjects: string[];
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const data = await res.json();
        setTeachers(data.teachers || []);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading teachers...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and view teacher performance</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search teachers..." 
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#f0f3f5]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 md:h-8 md:w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                      {t.name?.charAt(0) || '?'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{t.name || "Unknown"}</div>
                      <div className="text-sm text-gray-500">{t.email || ""}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {t.classes?.join(", ") || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {t.subjects?.join(", ") || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/teachers/${t.id}`} className="text-blue-600 hover:text-blue-900">
                    View Insights
                  </Link>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
