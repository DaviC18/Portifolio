/**
 * Plugins só do TrackMap (SPEC §7.4), separados de `gsap.ts` para ficarem no chunk lazy.
 */
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { gsap } from "./gsap";

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

export { DrawSVGPlugin, MotionPathPlugin };
