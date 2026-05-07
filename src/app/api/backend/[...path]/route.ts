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
  return base.replace(/\/+$/, "");
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;

  const backendBase = getBackendBaseUrl();
  const targetUrl = new URL(`${backendBase}/${path.join("/")}`);
  const incomingUrl = new URL(req.url);
  incomingUrl.searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));

  const headers = new Headers(req.headers);
  // Let fetch set correct host headers for target.
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  const res = await fetch(targetUrl.toString(), {
    method: req.method,
    headers,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.arrayBuffer(),
    redirect: "manual",
  });

  const outHeaders = new Headers(res.headers);
  // Avoid forwarding compressed responses that Next would need to re-handle.
  outHeaders.delete("content-encoding");
  outHeaders.delete("content-length");

  return new NextResponse(res.body, {
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

