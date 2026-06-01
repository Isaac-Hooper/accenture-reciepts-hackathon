import { useEffect, useState } from "react";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedReceipt, setExpandedReceipt] = useState(null);

  useEffect(() => {
    async function fetchReceipts() {
      try {
        const response = await fetch("http://localhost:8000/receipts");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setReceipts(data);
      } catch (err) {
        console.error("Error loading receipts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchReceipts();
  }, []);

  const toggleExpand = (id) => {
    setExpandedReceipt(expandedReceipt === id ? null : id);
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 text-purple-400 font-medium animate-pulse">
        🤖 Fetching decrypted receipt matrices...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 text-red-400 font-medium">
        ❌ Error parsing ledger database. Is your backend active?
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 text-center py-8">
      <h1 className="text-2xl font-bold text-purple-400 mb-8">Your Receipts</h1>

      {receipts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-purple-900/40 rounded-2xl bg-black max-w-md mx-auto">
          <div className="text-5xl mb-3 opacity-60">🧾</div>
          <p className="text-purple-400 font-medium">No uploaded receipts</p>
          <p className="text-neutral-500 text-sm mt-1">
            Scan a receipt in the upload panel to see its details here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-md mx-auto text-left">
          {receipts.map((receipt) => {
            const receiptId = receipt.id;
            const isExpanded = expandedReceipt === receiptId;

            // Format datetime string out of your SQLAlchemy timestamp
            const uploadDate = receipt.timestamp
              ? new Date(receipt.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
              : "Unknown Date";

            // Dynamically calculate total from all items inside the receipt
            const calculatedTotal = receipt.items?.reduce(
              (acc, item) => acc + (item.unit_price * item.quantity), 0
            ) || 0;

            return (
              <div
                key={receiptId}
                className="bg-black border border-purple-900/30 rounded-xl overflow-hidden transition-all duration-200 hover:border-purple-600/60 shadow-md"
              >
                {/* Clickable Header Row */}
                <div
                  onClick={() => toggleExpand(receiptId)}
                  className="p-4 flex justify-between items-center cursor-pointer select-none"
                >
                  <div>
                    <h3 className="font-bold text-purple-300 text-base">
                      {receipt.items?.[0]?.category || "General"} Purchase
                    </h3>
                    <span className="text-xs text-neutral-500">ID #{receiptId} • {uploadDate}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-extrabold text-purple-400">
                      £{calculatedTotal.toFixed(2)}
                    </span>
                    <span className="text-purple-500 text-xs transition-transform duration-200">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Collapsible Line Item Dropdown */}
                {isExpanded && (
                  <div className="bg-neutral-950/60 border-t border-purple-900/20 px-4 py-3 space-y-3">
                    <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">
                      Extracted Item Breakdown:
                    </p>

                    {!receipt.items || receipt.items.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">No line items parsed.</p>
                    ) : (
                      <div className="divide-y divide-purple-950/40">
                        {receipt.items.map((item) => (
                          <div key={item.id} className="py-2.5 flex justify-between items-start text-sm">
                            <div className="space-y-1 max-w-[70%]">
                              <p className="text-neutral-200 font-medium leading-tight">
                                {item.name}
                              </p>
                              <span className="inline-block text-[10px] px-2 py-0.5 bg-purple-950/40 border border-purple-900/30 rounded text-purple-400 uppercase tracking-tight">
                                {item.category}
                              </span>
                            </div>
                            <div className="text-right font-mono">
                              <p className="text-neutral-300">
                                £{(item.unit_price || 0).toFixed(2)}
                              </p>
                              <p className="text-[11px] text-neutral-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}