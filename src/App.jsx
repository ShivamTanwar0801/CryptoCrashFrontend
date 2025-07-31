import { useEffect, useState } from "react";
import io from "socket.io-client";
import PlayerForm from "./components/PlayerForm";
import Logs from "./components/Logs";
import PlayersTable from "./components/PlayersTable";

let socket;

export default function App() {
  const [logs, setLogs] = useState([]);
  const [playerId, setPlayerId] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [currency, setCurrency] = useState("bitcoin"); // ✅ fixed default
  const [roundNumber, setRoundNumber] = useState(null);
  const [multiplier, setMultiplier] = useState(1);
  const [players, setPlayers] = useState([]);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    socket = io(API_BASE, {
      transports: ["websocket"],
    });

    socket.on("connect", () =>
      appendLog("✅ Connected to WebSocket", "connected")
    );
    socket.on("round_start", (data) => {
      setMultiplier(1);
      setRoundNumber(data.roundNumber);
      appendLog("🚀 Round Start: " + JSON.stringify(data), "round-start");
    });
    socket.on("multiplier_update", (data) => {
      setMultiplier(data.multiplier);
      appendLog("📈 Multiplier: " + data.multiplier, "multiplier");
    });
    socket.on("cashout", (data) =>
      appendLog("💸 Cashout: " + JSON.stringify(data), "cashout")
    );
    socket.on("round_crash", (data) =>
      appendLog("💥 Crashed at: " + JSON.stringify(data) + "x", "crash")
    );
    socket.on("bet_placed", (data) =>
      appendLog(
        `🎯 Bet Placed: ${data.playerId} → $${data.usdAmount} USD in ${data.currency.toUpperCase()} (${data.cryptoAmount})`,
        "bet"
      )
    );

    return () => socket.disconnect();
  }, []);

  const appendLog = (message, type = "") => {
    setLogs((prev) => [...prev.slice(-499), { message, type }]);
  };

  const fetchPlayers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/player`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected array but received: " + JSON.stringify(data));
      }

      setPlayers(data);
    } catch (err) {
      appendLog("❌ Failed to load players: " + err.message, "error");
      setPlayers([]); // fallback
    }
  };

  const placeBet = async () => {
    if (!playerId || !usdAmount || !currency) {
      appendLog("⚠️ Missing bet input fields", "error");
      return;
    }

    if (isNaN(usdAmount) || Number(usdAmount) <= 0) {
      appendLog("⚠️ USD amount must be a positive number", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/bet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          usdAmount: Number(usdAmount),
          currency,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setRoundNumber(data.currentRound);
        fetchPlayers();
      }

      appendLog("🎯 Placed bet response: " + JSON.stringify(data), "bet");
    } catch (err) {
      appendLog(`❌ Failed to place bet: ${err.message}`, "error");
    }
  };

  const cashOut = async () => {
    if (!playerId || !roundNumber || !currency) {
      appendLog("⚠️ Missing data for cashout (playerId, roundNumber, or currency).", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cashout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          roundNumber,
          multiplier,
          currency,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded with status ${res.status}: ${text}`);
      }

      const data = await res.json();

      if (data.success) {
        fetchPlayers();
      } else {
        appendLog("❌ Cashout failed: " + (data.message || "Unknown error"), "error");
      }

      appendLog("💸 Cashout response: " + JSON.stringify(data), "cashout");
    } catch (err) {
      appendLog("❌ Error during cashout: " + err.message, "error");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPlayers();
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-[#1a1a2e] text-[#e0e0e0] font-mono min-h-screen p-4">
      <h1 className="text-center text-[#00f7ff] text-2xl font-bold mb-4">
        💥 Crypto Crash WebSocket Client
      </h1>
      <PlayersTable players={players} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <PlayerForm
          playerId={playerId}
          setPlayerId={setPlayerId}
          usdAmount={usdAmount}
          setUsdAmount={setUsdAmount}
          currency={currency}
          setCurrency={setCurrency}
          placeBet={placeBet}
          cashOut={cashOut}
        />
        <Logs logs={logs} setLogs={setLogs} />
      </div>
    </div>
  );
}
