"use client";

import { useMemo, useRef } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";
import { useTheme } from "next-themes";

interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
}

interface MapProps {
  dots?: Array<{
    start: MapPoint;
    end: MapPoint;
  }>;
  lineColor?: string;
  dotColor?: string;
  dotRadius?: number;
  travelDuration?: number;
}

const DEFAULT_DURATION = 4.5;

const getControlPoint = (
  start: { x: number; y: number },
  end: { x: number; y: number }
) => ({
    x: (start.x + end.x) / 2,
    y: Math.min(start.y, end.y) - 50,
});

const sampleCurve = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  segments = 60
) => {
  const control = getControlPoint(start, end);

  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x =
      (1 - t) * (1 - t) * start.x +
      2 * (1 - t) * t * control.x +
      t * t * end.x;
    const y =
      (1 - t) * (1 - t) * start.y +
      2 * (1 - t) * t * control.y +
      t * t * end.y;
    points.push({ x, y });
  }

  return points;
};

export default function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
  dotColor,
  dotRadius = 3,
  travelDuration = DEFAULT_DURATION,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const { theme } = useTheme();

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: theme === "dark" ? "black" : "white",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
  const control = getControlPoint(start, end);
  return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const curveSamples = sampleCurve(startPoint, endPoint);
          const cxSamples = curveSamples.map((point) => point.x);
          const cySamples = curveSamples.map((point) => point.y);

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              ></motion.path>
              <motion.circle
                r={dotRadius}
                fill={dotColor ?? lineColor}
                initial={{ cx: cxSamples[0], cy: cySamples[0], opacity: 0 }}
                animate={{
                  cx: cxSamples,
                  cy: cySamples,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: travelDuration,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 0.3 * i,
                }}
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r={dotRadius}
                fill={dotColor ?? lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r={dotRadius}
                fill={dotColor ?? lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from={dotRadius}
                  to={dotRadius * 2.5}
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r={dotRadius}
                fill={dotColor ?? lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r={dotRadius}
                fill={dotColor ?? lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from={dotRadius}
                  to={dotRadius * 2.5}
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

