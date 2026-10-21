import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/db.server";
import { checkCredentials, sessionCookie, clearCookie, isAdmin } from "@/lib/server/auth.server";

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => json({ authenticated: await isAdmin(request) }),
      POST: async ({ request }) => {
        try {
          const { email, password } = await request.json();
          if (!checkCredentials(email || "", password || "")) {
            await new Promise((r) => setTimeout(r, 600));
            return json({ error: "Invalid email or password" }, 401);
          }
          return json({ ok: true }, 200, { "Set-Cookie": await sessionCookie() });
        } catch (e) {
          console.error(e);
          return json({ error: "Admin login is not configured on the server." }, 503);
        }
      },
      DELETE: async () => json({ ok: true }, 200, { "Set-Cookie": clearCookie() }),
    },
  },
});
