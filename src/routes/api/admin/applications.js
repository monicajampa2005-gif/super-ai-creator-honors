import { createFileRoute } from "@tanstack/react-router";
import { getSql, json } from "@/lib/server/db.server";
import { isAdmin } from "@/lib/server/auth.server";
import { STATUSES } from "@/lib/categories";

export const Route = createFileRoute("/api/admin/applications")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await isAdmin(request))) return json({ error: "Unauthorized" }, 401);
        try {
          const rows = await getSql()`select * from applications order by created_at desc limit 5000`;
          return json({ applications: rows });
        } catch (e) { console.error(e); return json({ error: "Database unavailable or not configured" }, 503); }
      },
      PATCH: async ({ request }) => {
        if (!(await isAdmin(request))) return json({ error: "Unauthorized" }, 401);
        const { id, status, notes } = await request.json().catch(() => ({}));
        if (!id || !STATUSES.includes(status) || String(notes ?? "").length > 5000) return json({ error: "Invalid update" }, 400);
        try {
          const rows = await getSql()`update applications set status = ${status}, reviewer_notes = ${notes ?? ""}, updated_at = now() where id = ${id} returning *`;
          return rows[0] ? json({ application: rows[0] }) : json({ error: "Not found" }, 404);
        } catch (e) { console.error(e); return json({ error: "Update failed" }, 500); }
      },
    },
  },
});
