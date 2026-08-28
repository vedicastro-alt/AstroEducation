import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1740",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 24 24" fill="none">
          <path
            d="M11 15.5V21"
            stroke="#d4a24e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 15.5c0-3.2-2.3-5.5-6.4-5.5 0 3.7 1.8 6.4 6.4 6.4Z"
            stroke="#d4a24e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 18c0-3.6 2.5-6.4 6.9-6.4 0 4.1-2 7.3-6.9 7.3"
            stroke="#d4a24e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.5 3c.4 1.7 1 2.7 2.6 3.1-1.6.4-2.2 1.4-2.6 3.1-.4-1.7-1-2.7-2.6-3.1 1.6-.4 2.2-1.4 2.6-3.1Z"
            fill="#d4a24e"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
