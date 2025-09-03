import { NextRequest, NextResponse } from "next/server";

interface Params {
  width: string;
  height: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { width, height } = params;

  // Validate dimensions
  const w = parseInt(width);
  const h = parseInt(height);

  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0 || w > 1000 || h > 1000) {
    return NextResponse.json({ error: "Invalid dimensions" }, { status: 400 });
  }

  // Create a simple SVG placeholder
  const svg = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <circle cx="${w / 2}" cy="${h / 2 - 5}" r="${
    Math.min(w, h) * 0.25
  }" fill="#9ca3af"/>
      <path d="M${w * 0.25} ${h * 0.75} Q${w / 2} ${h * 0.6} ${w * 0.75} ${
    h * 0.75
  }" 
            fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
