import { useEffect, useState } from "react";

export default function InsightsPage() {
    const [insights, setInsights] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchInsights() {
            try {
                const response = await fetch("http://localhost:8000/insights");

                if (!response.ok) {
                    throw new Error("Failed to fetch insights");
                }

                const data = await response.json();

                setInsights(data.insights);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchInsights();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-16 text-center">
                <div className="text-purple-400 animate-pulse text-lg font-medium">
                    🤖 Analysing your spending habits...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-16 text-center">
                <div className="text-red-400 font-medium">
                    ❌ Failed to generate insights.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-purple-400 mb-8">
                Financial Insights
            </h1>

            <div className="grid gap-6">
                <div className="bg-black border border-purple-900/40 rounded-2xl p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-purple-300 mb-4">
                        AI Spending Analysis
                    </h2>

                    <div className="prose prose-invert max-w-none whitespace-pre-wrap text-neutral-200 leading-relaxed">
                        {insights}
                    </div>
                </div>
            </div>
        </div>
    );
}