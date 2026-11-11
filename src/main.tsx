import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/saira/wdth.css";
import "@fontsource/titillium-web/400.css";
import "@fontsource/titillium-web/600.css";
import "@fontsource/titillium-web/700.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "./styles/index.css";
import { MotionProvider } from "./lib/motion";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);

function render(Page: ComponentType) {
  root.render(
    <StrictMode>
      <MotionProvider>
        <Page />
      </MotionProvider>
    </StrictMode>,
  );
}

// `?demo=<nome>` abre `src/**/_demo-<nome>.tsx` (só em dev; removido na Fase 3)
const demo = import.meta.env.DEV ? new URLSearchParams(location.search).get("demo") : null;

if (demo) {
  const demos = import.meta.glob<{ default: ComponentType }>("./**/_demo-*.tsx");
  const entry = Object.entries(demos).find(([path]) => path.endsWith(`/_demo-${demo}.tsx`));
  if (entry) entry[1]().then((mod) => render(mod.default));
  else render(App);
} else {
  render(App);
}
