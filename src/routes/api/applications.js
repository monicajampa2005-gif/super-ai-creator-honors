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
              error:
                "Submissions are not available yet: the database or file storage has not been configured.",
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
            (reference_no, full_name, phone, email, city, state, pincode, profile_link, category,
             content_link_1, content_link_2, content_link_3, profile_image, screenshots, consent)
            values (${ref}, ${v.fullName}, ${v.phone}, ${v.email.toLowerCase()}, ${v.city}, ${v.state}, ${v.pincode}, ${v.profileLink}, ${v.category},
             ${v.link1}, ${v.link2}, ${v.link3}, ${photoBlob.pathname}, ${JSON.stringify(shots.map((s) => s.pathname))}::jsonb, true)`;
          return json({ referenceNo: ref, category: categoryById(v.category).name }, 201);
        } catch (err) {
          console.error("Application save failed", err);
          return json({ error: "We could not save your application. Please try again." }, 500);
        }
      },
    },
  },
});
