import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/saira/wdth.css";
import "@fontsource/titillium-web/400.css";
import "@fontsource/titillium-web/600.css";
import "@fontsource/titillium-web/700.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "./styles/index.css";
import { MotionProvider } from "./lib/motion";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>,
);
