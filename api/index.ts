import type { VercelRequest, VercelResponse } from "@vercel/node";

// Dynamically import the TanStack Start server entry.
// The Cloudflare-specific error-capture / error-page imports are harmless
// — they only run if TanStack Start routes through that code path.
async function getStartHandler() {
  const m: unknown = await import("../../src/server.ts");
  return m as { default: { fetch(request: Request): Promise<Response> } };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let server;
  try {
    server = await getStartHandler();
  } catch (err) {
    console.error("Failed to load TanStack Start server entry:", err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end("<h1>Startup Error</h1><p>Failed to load server handler.</p>");
    return;
  }

  try {
    const url = typeof req.url === "string" ? req.url : "";
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        value.forEach((v) => { headers[key] = v; });
      } else if (typeof value === "string") {
        headers[key] = value;
      }
    }

    const method = req.method ?? "GET";
    const body = typeof req.body === "string" ? Buffer.from(req.body) : Buffer.from(JSON.stringify(req.body ?? {}));

    const request = new Request(`http://localhost${url}`, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : body,
    });

    const response = await server.fetch(request);

    res.statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    const responseBody = Buffer.from(await response.arrayBuffer());
    res.send(responseBody);
  } catch (error) {
    console.error("SSR handler error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end("<h1>500 Internal Server Error</h1>");
  }
}
