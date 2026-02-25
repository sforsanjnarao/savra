"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyData } from "../lib/api";

interface WeeklyChartProps {
  data: WeeklyData[];
}

const COLORS: Record<string, string> = {
  LESSON:     "#10b981", // emerald
  QUIZ:       "#f59e0b", // amber
  ASSESSMENT: "#ef4444", // rose
};
const FALLBACK_COLORS = ["#9333ea", "#3b82f6", "#06b6d4"];

export default function WeeklyChart({ data }: WeeklyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
        No weekly data available.
      </div>
    );
  }

  const activityTypes = Object.keys(data[0] ?? {}).filter((k) => k !== "week");

  // Shorten x-axis labels: "2026-W07" → "W07"
  const chartData = data.map((d) => ({
    ...d,
    week: String(d.week).replace(/^\d{4}-/, ""),
  }));

  return (
    <div className="w-full h-72 bg-white rounded-xl border border-gray-200 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" stroke="#9ca3af" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {activityTypes.map((type, idx) => {
            const color = COLORS[type] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
            return (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                name={type.charAt(0) + type.slice(1).toLowerCase()}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
