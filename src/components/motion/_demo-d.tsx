/**
 * Demo do WP-D (`?demo=d`, só em dev; removido na Fase 3).
 * Página longa falsa com os ids das seções para testar o TrackMap (≥1280px) e as SpeedLines.
 * Rótulos daqui são só de teste.
 */
import { useState } from "react";
import { MotionToggle } from "@/components/common/MotionToggle";
import { SpeedLines } from "@/components/motion/SpeedLines";
import { TrackMap } from "@/components/motion/TrackMap";
import { nav } from "@/content/site";

const IDS = ["grid", "radio", "classificacao", "telemetria", "setup", "piloto", "box"];

export default function DemoD() {
  const [run, setRun] = useState(0);
  return (
    <>
      <div className="fixed top-3 left-3 z-50 flex gap-3">
        <MotionToggle />
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="min-h-11 rounded-panel border border-line bg-carbon-950 px-4 font-mono text-xs"
        >
          intro speedlines #{run}
        </button>
      </div>
      <main id="conteudo">
        {IDS.map((id, i) => (
          <section
            key={id}
            id={id}
            className={`relative isolate flex min-h-[110vh] items-center ${i % 2 ? "bg-carbon-900" : "bg-carbon-950"}`}
          >
            {id === "grid" && <SpeedLines variant="hero" />}
            <div className="container-site">
              <p className="font-mono text-xs tracking-[0.2em] text-silver-500 uppercase">#{id}</p>
              <p className="font-condensed text-6xl font-bold uppercase">
                {nav.find((n) => n.id === id)?.label ?? id}
              </p>
            </div>
          </section>
        ))}
      </main>
      {run > 0 && (
        <div className="pointer-events-none fixed inset-0 z-40">
          <SpeedLines key={run} variant="intro" active />
        </div>
      )}
      <TrackMap />
    </>
  );
}
