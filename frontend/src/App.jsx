import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import InsightsPage from "./pages/InsightsPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* Changed page background to a very dark gray/black */}
      <div className="min-h-screen bg-neutral-950 text-gray-100">

        {/* Navigation Bar: Solid black with a subtle purple bottom border */}
        <nav className="bg-black border-b border-purple-900/40 shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4 flex gap-8 items-center">

            {/* Branding: Deep Purple */}
            <span className="font-extrabold text-xl tracking-tight text-purple-500">
              Budget Buddy
            </span>

            {/* Navigation Links */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-purple-400 border-b-2 border-purple-500 pb-1"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              Upload
            </NavLink>

            <NavLink
              to="/receipts"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-purple-400 border-b-2 border-purple-500 pb-1"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              Receipts
            </NavLink>

            <NavLink
              to="/insights"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-purple-400 border-b-2 border-purple-500 pb-1"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              Insights
            </NavLink>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/receipts" element={<ReceiptsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}