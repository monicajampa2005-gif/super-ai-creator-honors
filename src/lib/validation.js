export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE = 5 * 1024 * 1024;
export const MAX_SCREENSHOTS = 10;

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || "");
export const isPhone = (v) =>
  /^[6-9]\d{9}$/.test((v || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""));
export const isPin = (v) => /^[1-9]\d{5}$/.test(v || "");
export const isUrl = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};
export const fileError = (f) => {
  if (!f) return "File is required";
  if (!IMAGE_TYPES.includes(f.type)) return `${f.name}: only JPG, JPEG, PNG or WEBP allowed`;
  if (f.size > MAX_FILE) return `${f.name}: must be 5 MB or smaller`;
  return null;
};

export const TEXT_FIELDS = [
  "fullName",
  "phone",
  "email",
  "address",
  "city",
  "state",
  "pincode",
  "profileLink",
  "link1",
  "link2",
  "link3",
];

/** Validates plain values + files. Returns { field: message }. */
export function validateApplication(v, screenshots, photo, validCategory) {
  const e = {};
  for (const k of TEXT_FIELDS) if (!String(v[k] || "").trim()) e[k] = "Required";
  for (const k of TEXT_FIELDS) if (String(v[k] || "").length > 500) e[k] = "Too long";
  if (v.email && !isEmail(v.email)) e.email = "Enter a valid email";
  if (v.phone && !isPhone(v.phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
  if (v.pincode && !isPin(v.pincode)) e.pincode = "Enter a valid 6-digit PIN code";
  for (const k of ["profileLink", "link1", "link2", "link3"])
    if (v[k] && !isUrl(v[k])) e[k] = "Enter a valid URL (https://…)";
  // category is now an array
  const cats = Array.isArray(v.category) ? v.category : v.category ? [v.category] : [];
  if (!cats.length) e.category = "Select at least one category";
  else if (cats.length > 9) e.category = "Too many categories selected";
  else if (cats.some((c) => !validCategory(c))) e.category = "Invalid category selected";
  if (!screenshots?.length) e.screenshots = "Upload at least one screenshot";
  else if (screenshots.length > MAX_SCREENSHOTS)
    e.screenshots = `Maximum ${MAX_SCREENSHOTS} screenshots`;
  else {
    const bad = screenshots.map(fileError).find(Boolean);
    if (bad) e.screenshots = bad;
  }
  const pe = fileError(photo);
  if (pe) e.photo = pe === "File is required" ? "Upload your image" : pe;
  if (!v.consent) e.consent = "Consent is required";
  return e;
}
