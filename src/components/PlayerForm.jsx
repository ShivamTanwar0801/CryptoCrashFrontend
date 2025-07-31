export default function PlayerForm({
  playerId,
  setPlayerId,
  usdAmount,
  setUsdAmount,
  currency,
  setCurrency,
  placeBet,
  cashOut,
}) {
  return (
    <div className="space-y-3">
      <input
        className="w-full p-2 bg-[#282c34] border border-[#444] rounded"
        placeholder="Player ID"
        value={playerId}
        onChange={(e) => setPlayerId(e.target.value)}
      />
      <input
        className="w-full p-2 bg-[#282c34] border border-[#444] rounded"
        placeholder="USD Amount"
        value={usdAmount}
        onChange={(e) => setUsdAmount(e.target.value)}
        type="number"
        min="0"
      />
      <select
        className="w-full p-2 bg-[#282c34] border border-[#444] rounded"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="bitcoin">Bitcoin</option>
        <option value="ethereum">Ethereum</option>
      </select>
      <div className="flex gap-4">
        <button
          className="bg-[#00f7ff] text-[#1a1a2e] font-bold py-2 px-4 rounded"
          onClick={placeBet}
        >
          🎯 Place Bet
        </button>
        <button
          className="bg-[#ffd700] text-[#1a1a2e] font-bold py-2 px-4 rounded"
          onClick={cashOut}
        >
          💸 Cash Out
        </button>
      </div>
    </div>
  );
}
