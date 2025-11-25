import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Aplicar tema antes do React renderizar para evitar flash
const savedTheme = localStorage.getItem("theme") || "dark";
const root = document.documentElement;

if (savedTheme === "auto") {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", prefersDark ? "dark" : "light");
} else {
  root.setAttribute("data-theme", savedTheme);
}

createRoot(document.getElementById("root")!).render(<App />);
