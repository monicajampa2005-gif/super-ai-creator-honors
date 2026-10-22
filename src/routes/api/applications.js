import { createFileRoute } from "@tanstack/react-router";
import { put } from "@vercel/blob";
import { getSql, json } from "@/lib/server/db.server";
import { validateApplication, TEXT_FIELDS } from "@/lib/validation";
import { categoryById } from "@/lib/categories";

const refNo = () => {
  const a = new Uint8Array(4);
  crypto.getRandomValues(a);
  return (
    "SAICEA26-" +
    Array.from(a, (b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
};
const ext = (t) => ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" })[t];

export const Route = createFileRoute("/api/applications")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!process.env.DATABASE_URL || !process.env.BLOB_READ_WRITE_TOKEN) {
          return json(
            {
              error: !process.env.DATABASE_URL
                ? "DATABASE_URL is not configured on the server."
                : "BLOB_READ_WRITE_TOKEN is not configured on the server.",
            },
            503,
          );
        }
        let form;
        try {
          form = await request.formData();
        } catch {
          return json({ error: "Invalid submission" }, 400);
        }
        const v = {};
        for (const k of TEXT_FIELDS) v[k] = String(form.get(k) || "").trim();
        v.consent = form.get("consent") === "true";
        // category is now a multi-value array
        const categories = form.getAll("category").map((c) => String(c).trim()).filter(Boolean);
        v.category = categories;
        const screenshots = form.getAll("screenshots").filter((f) => typeof f === "object");
        const photo = form.get("photo");
        const errors = validateApplication(
          v,
          screenshots,
          typeof photo === "object" ? photo : null,
          (id) => !!categoryById(id),
        );
        if (Object.keys(errors).length)
          return json({ error: "Please fix the highlighted fields", errors }, 422);

        const ref = refNo();
        try {
          const token = process.env.BLOB_READ_WRITE_TOKEN;
          const upload = (f, name) =>
            put(`applications/${ref}/${name}.${ext(f.type)}`, f, {
              access: "private",
              token,
              contentType: f.type,
              addRandomSuffix: true,
            });
          const [photoBlob, ...shots] = await Promise.all([
            upload(photo, "profile"),
            ...screenshots.map((f, i) => upload(f, `screenshot-${i + 1}`)),
          ]);
          const sql = getSql();
          await sql`insert into applications
            (reference_no, full_name, phone, email, address, city, state, pincode, profile_link, category,
             content_link_1, content_link_2, content_link_3, profile_image, screenshots, consent)
            values (${ref}, ${v.fullName}, ${v.phone}, ${v.email.toLowerCase()}, ${v.address}, ${v.city}, ${v.state}, ${v.pincode}, ${v.profileLink}, ${JSON.stringify(v.category)}::jsonb,
             ${v.link1}, ${v.link2}, ${v.link3}, ${photoBlob.pathname}, ${JSON.stringify(shots.map((s) => s.pathname))}::jsonb, true)`;
          return json({ referenceNo: ref, categories: v.category.map((id) => categoryById(id)?.name).join(", ") }, 201);
        } catch (err) {
          console.error("Application save failed", err);
          return json({ error: `Submission failed: ${err?.message || err}` }, 500);
        }
      },
    },
  },
});
