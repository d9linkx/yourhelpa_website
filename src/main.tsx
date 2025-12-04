import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from 'react-router-dom'; // <-- ADDED: Import BrowserRouter

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter> {/* <-- ADDED: Wrapper to enable routing */}
      <App />
    </BrowserRouter>
  );
} else {
  console.error("Root element not found.");
}