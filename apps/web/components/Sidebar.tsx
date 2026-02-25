"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  
  // Do not render sidebar on login page
  if (pathname === "/login") return null;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen p-4 sticky top-0">
      <div className="flex items-center mb-8 px-2">
        <h1 className="text-2xl font-bold tracking-tight text-blue-600">SAVRA</h1>
      </div>
      
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">Main</p>
        <Link 
          href="/" 
          className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${pathname === '/' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/teachers" 
          className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${pathname.startsWith('/teachers') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
          Teachers
        </Link>
      </div>
      
      <div className="mt-auto items-center flex px-2 py-4">
        <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white text-xs mr-3">
          SR
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-900 leading-none">SCHOOL ADMIN</p>
          <p className="text-xs text-gray-500 mt-1">Shauriyaman Ray</p>
        </div>
      </div>
    </div>
  );
}
