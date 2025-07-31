export default function PlayersTable({ players }) {
  const isValidArray = Array.isArray(players);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-[#00f7ff] mb-2">🧑‍💻 Players</h2>
      <div className="overflow-auto rounded border border-[#444]">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-[#2f2f3d] text-[#00f7ff]">
            <tr>
              <th className="px-4 py-2 border-r border-[#444]">Player ID</th>
              <th className="px-4 py-2">Wallet</th>
            </tr>
          </thead>
          <tbody>
            {!isValidArray ? (
              <tr>
                <td className="px-4 py-2 text-center text-red-400" colSpan="2">
                  ❌ Failed to load players
                </td>
              </tr>
            ) : players.length === 0 ? (
              <tr>
                <td className="px-4 py-2 text-center" colSpan="2">
                  No players found.
                </td>
              </tr>
            ) : (
              players.map((p) => (
                <tr key={p.playerId} className="border-t border-[#444]">
                  <td className="px-2 py-1 border-r border-[#444] break-all">
                    {p.playerId}
                  </td>
                  <td className="px-2 py-1 space-y-1 text-[12px]">
                    {Object.entries(p.wallet).map(([curr, { amount, usd }]) => (
                      <div key={curr}>
                        <span className="text-yellow-300">{curr}</span>:{" "}
                        {amount.toFixed(6)} → ${usd ? usd.toFixed(2) : "N/A"}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
