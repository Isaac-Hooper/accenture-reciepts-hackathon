export default function InsightsPage() {
  return (
    <div className="max-w-lg mx-auto text-center py-8">
      <div className="text-6xl mb-4">📊</div>
      <h1 className="text-2xl font-bold text-purple-400 mb-6">
        Spending Insights
      </h1>

      <div className="max-w-md text-left mx-auto">
        <div className="p-4 bg-black border border-purple-900/40 rounded-lg text-sm text-purple-300 shadow-sm">
          <p className="font-semibold mb-1 text-purple-400">💡 TODO for you to build:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Call{" "}
              <code className="bg-purple-950/40 text-purple-300 px-1 rounded border border-purple-800/30">
                GET /insights
              </code>{" "}
              to fetch AI analysis
            </li>
            <li>Render spending by category (pie or bar chart)</li>
            <li>Show monthly trends and top merchants</li>
            <li>Display AI-generated saving tips</li>
          </ul>
        </div>
      </div>
    </div>
  );
}