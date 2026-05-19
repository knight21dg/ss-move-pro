import type { CSSProperties } from "react";

/**
 * TruckLoader
 *
 * A theme-aware animated SVG truck that matches the project's design system.
 * Uses CSS custom properties on the `:root` / `.dark` scope so it automatically
 * picks up light or dark theme colours.
 *
 * Usage
 * ```tsx
 * <TruckLoader />
 * <TruckLoader size={64} trackColor="orange" />
 * ```
 */
export function TruckLoader({
  size = 48,
  trackColor = "currentColor",
  style,
  className = "",
}: {
  size?: number;
  trackColor?: string;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      className={`truck-loader ${className}`.trim()}
      viewBox="0 0 48 24"
      width={size}
      height={(size * 24) / 48}
      style={style}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke={trackColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        transform="translate(0, 2)"
      >
        <g className="truck-loader__body">
          <g strokeDasharray="105 105">
            <polyline
              className="truck-loader__outside1"
              points="2 17,1 17,1 11,5 9,7 1,39 1,39 6"
            />
            <polyline
              className="truck-loader__outside2"
              points="39 12,39 17,31.5 17"
            />
            <polyline
              className="truck-loader__outside3"
              points="22.5 17,11 17"
            />
            <polyline
              className="truck-loader__window1"
              points="6.5 4,8 4,8 9,5 9"
            />
            <polygon
              className="truck-loader__window2"
              points="10 4,10 9,14 9,14 4"
            />
          </g>
          <polyline
            className="truck-loader__line"
            points="43 8,31 8"
            strokeDasharray="10 2 10 2 10 2 10 2 10 2 10 26"
          />
          <polyline
            className="truck-loader__line"
            points="47 10,31 10"
            strokeDasharray="14 2 14 2 14 2 14 2 14 18"
          />
        </g>
        <g strokeDasharray="15.71 15.71">
          <g className="truck-loader__wheel">
            <circle className="truck-loader__wheel-spin" r="2.5" cx="6.5" cy="17" />
          </g>
          <g className="truck-loader__wheel">
            <circle
              className="truck-loader__wheel-spin"
              r="2.5"
              cx="27"
              cy="17"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
