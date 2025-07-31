import { useEffect, useRef, useState } from "react";

const typeColors = {
  connected: "text-green-400",
  "round-start": "text-cyan-400",
  multiplier: "text-emerald-400",
  cashout: "text-yellow-400",
  crash: "text-red-400",
  bet: "text-orange-400",
  error: "text-red-300",
};

export default function Logs({ logs, setLogs }) {
  const logRef = useRef();
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
      setAutoScroll(isAtBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (autoScroll && el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs, autoScroll]);

  const scrollToBottom = () => {
    const el = logRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
    setAutoScroll(true);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="relative">
      {/* Logs container */}
      <div
        id="log"
        ref={logRef}
        className="bg-[#282c34] border border-[#444] p-4 rounded h-[50vh] overflow-y-auto text-[12px]"
      >
        {logs.map((entry, idx) => (
          <div
            key={idx}
            className={`log-entry ${typeColors[entry.type] || "text-white"}`}
          >
            {entry.message}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-gray-400">No logs to display.</div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-2">
        <button
          onClick={clearLogs}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
        >
          🧹 Clear Logs
        </button>

        {!autoScroll && (
          <button
            onClick={scrollToBottom}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
          >
            ⬇ Scroll to Bottom
          </button>
        )}
      </div>
    </div>
  );
}
