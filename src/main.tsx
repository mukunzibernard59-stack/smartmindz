import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import clearAppCache from "./lib/cacheCleaner";

createRoot(document.getElementById("root")!).render(<App />);

// Keep stale cache cleanup off the critical rendering path.
const cleanStaleCaches = () => {
  clearAppCache({ preserveChat: true }).catch(() => {});
};

const requestIdleCallback = window.requestIdleCallback?.bind(window);

if (requestIdleCallback) {
  requestIdleCallback(cleanStaleCaches, { timeout: 5000 });
} else {
  globalThis.setTimeout(cleanStaleCaches, 2500);
}
