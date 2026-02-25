interface AIInsightPanelProps {
  summary: string;
  loading?: boolean;
}

export default function AIInsightPanel({ summary, loading }: AIInsightPanelProps) {
  if (loading) {
    return (
      <div className="bg-[#fcfaf5] rounded-xl border border-[#f3e9d8] p-6 flex items-center justify-center h-48">
        <div className="text-sm text-gray-400 animate-pulse">Generating AI insights…</div>
      </div>
    );
  }

  // Detect whether the summary is a multi-line structured list or a prose paragraph
  const lines = summary.split("\n").map((l) => l.trim()).filter(Boolean);
  const isStructured = lines.some((l) => l.startsWith("-"));

  // Prose paragraph from OpenAI
  if (!isStructured) {
    return (
      <div className="bg-[#fcfaf5] rounded-xl border border-[#f3e9d8] p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🤖</span>
          <p className="text-sm font-semibold text-gray-700">AI Pulse Summary</p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
      </div>
    );
  }

  // Fallback structured list from backend
  const bulletLines = lines.filter((l) => l.startsWith("-")).map((l) => l.replace(/^-\s*/, ""));
  return (
    <div className="bg-[#fcfaf5] rounded-xl border border-[#f3e9d8] p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📊</span>
        <p className="text-sm font-semibold text-gray-700">Activity Summary</p>
      </div>
      <div className="space-y-2 overflow-y-auto max-h-52">
        {bulletLines.map((line, i) => {
          const [label, ...rest] = line.split(":");
          return (
            <div key={i} className="bg-white rounded-lg p-2.5 border border-[#ede9dc]">
              <p className="text-xs font-semibold text-gray-700">{(label ?? "").trim()}</p>
              {rest.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">{rest.join(":").trim()}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
