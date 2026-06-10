import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import clearAppCache from "./lib/cacheCleaner";

// Clear older cached UI and service workers before mounting app
// This prevents stale UI from flashing on startup.
(async () => {
	try { await clearAppCache({ preserveChat: true }); } catch (e) { /* ignore */ }
	createRoot(document.getElementById("root")!).render(<App />);
})();
