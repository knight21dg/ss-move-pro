import { createFileRoute } from "@tanstack/react-router";
import crypto from "crypto";

export const Route = createFileRoute("/api/sign-cloudinary")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const folder = body.folder || "uploads";
          
          const timestamp = Math.round(Date.now() / 1000);
          
          const apiSecret = process.env.CLOUDINARY_API_SECRET;
          const apiKey = process.env.CLOUDINARY_API_KEY;
          const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dp9pbu8wr";
          
          if (!apiSecret || !apiKey) {
            return new Response(
              JSON.stringify({ error: "Cloudinary credentials not configured on the server." }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }
          
          // Parameters to sign (sorted alphabetically by key)
          const params: Record<string, any> = {
            folder,
            timestamp,
          };
          
          const sortedKeys = Object.keys(params).sort();
          const strToSign = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
          
          const signature = crypto
            .createHash("sha1")
            .update(strToSign + apiSecret)
            .digest("hex");
            
          return new Response(
            JSON.stringify({
              signature,
              timestamp,
              apiKey,
              cloudName,
              folder,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error: any) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }
});
