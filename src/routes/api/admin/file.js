import { createFileRoute } from "@tanstack/react-router";
import { get } from "@vercel/blob";
import { isAdmin } from "@/lib/server/auth.server";

// Streams a private blob to an authenticated admin only.
export const Route = createFileRoute("/api/admin/file")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await isAdmin(request))) return new Response("Unauthorized", { status: 401 });
        const path = new URL(request.url).searchParams.get("path") || "";
        if (!/^applications\/SAICEA26-[A-F0-9]{8}\/[\w.-]+$/.test(path)) return new Response("Bad path", { status: 400 });
        try {
          const res = await get(path, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN });
          if (!res || !res.stream) return new Response("Not found", { status: 404 });
          return new Response(res.stream, { headers: { "Content-Type": res.blob?.contentType || "image/jpeg", "Cache-Control": "private, no-store" } });
        } catch (e) { console.error(e); return new Response("File unavailable", { status: 502 }); }
      },
    },
  },
});
