import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CATEGORIES, categoryById } from "@/lib/categories";
import { validateApplication } from "@/lib/validation";
import { ImageUpload } from "./ImageUpload";

const EMPTY = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  pincode: "",
  profileLink: "",
  link1: "",
  link2: "",
  link3: "",
  consent: false,
};

function Group({ n, label, children }) {
  return (
    <fieldset className="rounded-xl border border-border bg-card/50 p-5">
      <legend className="flex items-center gap-3 px-1 text-sm font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-gradient text-xs text-primary-foreground">
          {n}
        </span>
        {label} <span className="text-destructive">*</span>
      </legend>
      <div className="mt-2">{children}</div>
    </fieldset>
  );
}
const Err = ({ m }) => (m ? <p className="mt-1 text-xs text-destructive">{m}</p> : null);

export function ApplicationForm({ category, setCategory }) {
  const [v, setV] = useState(EMPTY);
  const [shots, setShots] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: "idle" });
  const set = (k) => (e) =>
    setV({ ...v, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const input = (k, props = {}) => (
    <>
      <input
        className="field"
        value={v[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        {...props}
      />
      <Err m={errors[k]} />
    </>
  );

  // category is now an array managed by parent; toggle a single item in/out
  const toggleCategory = (id) => {
    const next = category.includes(id)
      ? category.filter((c) => c !== id)
      : [...category, id];
    setCategory(next);
  };

  async function submit(e) {
    e.preventDefault();
    if (state.status === "loading") return;
    const values = { ...v, category };
    const errs = validateApplication(values, shots, photo[0], (id) => !!categoryById(id));
    setErrors(errs);
    if (Object.keys(errs).length) {
      setState({ status: "error", message: "Please fix the highlighted fields." });
      return;
    }
    setState({ status: "loading" });
    const fd = new FormData();
    // append all fields except category
    Object.entries(v).forEach(([k, val]) => fd.append(k, String(val)));
    // send each selected category as a separate form value
    category.forEach((c) => fd.append("category", c));
    shots.forEach((f) => fd.append("screenshots", f));
    fd.append("photo", photo[0]);
    try {
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.referenceNo) {
        if (data.errors) setErrors(data.errors);
        setState({
          status: "error",
          message: data.error || "Submission failed. Please try again.",
        });
        return;
      }
      setState({ status: "success", ...data });
    } catch {
      setState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="fade-up rounded-2xl border border-gold/50 bg-card p-10 text-center shadow-gold">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
        <h3 className="mt-4 text-2xl font-bold">Application Submitted Successfully!</h3>
        <p className="mt-4 text-muted-foreground">Reference number</p>
        <p className="font-display text-2xl text-gold-gradient">{state.referenceNo}</p>
        <p className="mt-4 text-muted-foreground">
          Categories:{" "}
          <span className="text-foreground">{state.categories}</span>
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Please save your reference number.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Group n={1} label="Full Name">
        {input("fullName", { autoComplete: "name", maxLength: 120 })}
      </Group>
      <Group n={2} label="Mobile Number / WhatsApp Number">
        <div className="flex gap-2">
          <span className="field w-16 shrink-0 text-center">+91</span>
          <div className="flex-1">
            {input("phone", {
              type: "tel",
              inputMode: "numeric",
              maxLength: 10,
              placeholder: "10-digit number",
            })}
          </div>
        </div>
      </Group>
      <Group n={3} label="Email Address">
        {input("email", { type: "email", autoComplete: "email" })}
      </Group>
      <Group n={4} label="City and State, Pincode">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>{input("city", { placeholder: "City" })}</div>
          <div>{input("state", { placeholder: "State" })}</div>
          <div>
            {input("pincode", { placeholder: "Pincode", inputMode: "numeric", maxLength: 6 })}
          </div>
        </div>
      </Group>
      <Group n={5} label="Instagram / YouTube / Facebook Profile Link">
        {input("profileLink", { type: "url", placeholder: "https://" })}
      </Group>
      <Group n={6} label="Award Category Applying For (select all that apply)">
        <div className="grid gap-2 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                category.includes(c.id)
                  ? "border-[var(--gold)] bg-accent"
                  : "border-border hover:border-[var(--gold-soft)]"
              }`}
            >
              <input
                type="checkbox"
                checked={category.includes(c.id)}
                onChange={() => toggleCategory(c.id)}
                className="mt-0.5 h-4 w-4 accent-[var(--gold)]"
              />
              <span className="text-sm leading-snug">
                <span className="font-semibold">{c.name}</span>
                <span className="ml-1 text-xs text-muted-foreground">— {c.winners} winners</span>
              </span>
            </label>
          ))}
        </div>
        <Err m={errors.category} />
      </Group>
      <Group n={7} label="Best 3 Content Links Created During the Challenge">
        <div className="space-y-3">
          {["link1", "link2", "link3"].map((k, i) => (
            <div key={k}>
              {input(k, { type: "url", placeholder: `Content link ${i + 1} (https://)` })}
            </div>
          ))}
        </div>
      </Group>
      <Group n={8} label="Relevant Screenshots">
        <ImageUpload
          id="shots"
          multiple
          files={shots}
          onChange={setShots}
          error={errors.screenshots}
        />
      </Group>
      <Group n={9} label="Upload Your Image">
        <ImageUpload id="photo" files={photo} onChange={setPhoto} error={errors.photo} />
      </Group>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={v.consent}
          onChange={set("consent")}
          className="mt-1 h-4 w-4 accent-[var(--gold)]"
        />
        <span>
          I confirm the information is accurate and consent to Super AI Academy storing and
          reviewing my details and images for the purpose of evaluating this award application.
        </span>
      </label>
      <Err m={errors.consent} />

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={state.status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient py-3.5 font-semibold text-primary-foreground shadow-gold disabled:opacity-60"
      >
        {state.status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}
