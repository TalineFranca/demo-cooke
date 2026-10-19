import { ImageResponse } from "next/og";

export const alt = "Cookê · Se for para adoçar o dia, que seja com Cookê";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ImagemOG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1A0FB5",
          color: "#fff",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#F5A6CF" }}>
          Cookies artesanais · Carapicuíba-SP
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: 999,
              background: "#d99d58",
              border: "14px solid #a9672c",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", fontSize: 220, fontWeight: 800, color: "#F5A6CF", fontStyle: "italic", letterSpacing: -8 }}>
            Cookê
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, textTransform: "uppercase" }}>
          Se for para adoçar o dia, que seja com Cookê
        </div>
      </div>
    ),
    size,
  );
}
