import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Font Awesome CSS
const fontAwesomeCSS = document.createElement("link");
fontAwesomeCSS.rel = "stylesheet";
fontAwesomeCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(fontAwesomeCSS);

// Add Google Fonts
const googleFontsCSS = document.createElement("link");
googleFontsCSS.rel = "stylesheet";
googleFontsCSS.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono&display=swap";
document.head.appendChild(googleFontsCSS);

// Set document title
document.title = "TapTalk - Chat with Gemini AI";

createRoot(document.getElementById("root")!).render(<App />);
