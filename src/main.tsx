import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Analytics from "./components/Analytics.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Analytics />
  </>
);
