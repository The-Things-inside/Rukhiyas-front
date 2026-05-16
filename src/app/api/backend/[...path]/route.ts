import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBackendBaseUrl() {
  const base = process.env.BACKEND_API_URL;
  if (!base) {
    throw new Error(
      "BACKEND_API_URL is not set. Configure it in your hosting environment.",
    );
  }
  let normalized = base.trim().replace(/\/+$/, "");
  // Never proxy over plain HTTP — avoids mixed-content if the API redirects to http://
  if (normalized.startsWith("http://")) {
    normalized = `https://${normalized.slice("http://".length)}`;
  }
  return normalized;
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;

  const backendBase = getBackendBaseUrl();
  const pathSegments = path.filter((segment) => segment.length > 0);
  let targetPath = pathSegments.join("/");
  // FastAPI redirects POST /buses → http://.../buses/ (mixed content in browser).
  // Call /buses/ directly on the backend.
  if (
    targetPath === "buses" &&
    (req.method === "POST" || req.method === "PUT" || req.method === "PATCH")
  ) {
    targetPath = "buses/";
  }
  const targetUrl = new URL(
    targetPath ? `${backendBase}/${targetPath}` : backendBase,
  );
  const incomingUrl = new URL(req.url);
  incomingUrl.searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));

  // Only forward headers the backend needs. Browser Origin/Referer/Cookie from
  // LAN dev URLs can cause intermittent 403 responses from the API.
  const headers = new Headers();
  const forward = [
    "accept",
    "authorization",
    "content-type",
    "accept-language",
  ] as const;
  for (const name of forward) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }

  const res = await fetch(targetUrl.toString(), {
    method: req.method,
    headers,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.arrayBuffer(),
    // Follow redirects on the server so the browser never hits http:// API URLs.
    redirect: "follow",
  });

  // Read body here so Node decompresses gzip/br before forwarding. Streaming
  // `res.body` after stripping `content-encoding` yields binary JSON parse errors.
  const body = await res.arrayBuffer();

  const outHeaders = new Headers(res.headers);
  outHeaders.delete("content-encoding");
  outHeaders.delete("content-length");

  return new NextResponse(body, {
    status: res.status,
    statusText: res.statusText,
    headers: outHeaders,
  });
}

export async function GET(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function POST(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function PUT(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: any) {
  return proxy(req, ctx);
}

