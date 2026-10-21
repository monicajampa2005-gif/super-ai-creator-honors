import { useEffect, useMemo, useRef } from "react";
import { X, Upload } from "lucide-react";

function Preview({ file, onRemove }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
      <img src={url} alt={file.name} className="h-28 w-full object-cover" />
      <div className="truncate px-2 py-1 text-xs text-muted-foreground">
        {file.name} · {(file.size / 1048576).toFixed(1)} MB
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="absolute right-1 top-1 rounded-full bg-background/80 p-1"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ImageUpload({ multiple, files, onChange, error, id }) {
  const ref = useRef(null);
  const add = (list) => {
    const picked = Array.from(list || []);
    onChange(multiple ? [...files, ...picked] : picked.slice(0, 1));
    if (ref.current) ref.current.value = "";
  };
  return (
    <div>
      <input
        ref={ref}
        id={id}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => add(e.target.files)}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gold/50 py-5 text-sm text-gold hover:bg-gold/5"
      >
        <Upload className="h-4 w-4" />{" "}
        {files.length
          ? multiple
            ? "Add more images"
            : "Replace image"
          : multiple
            ? "Choose images"
            : "Choose image"}
      </button>
      <p className="mt-1 text-xs text-muted-foreground">JPG, JPEG, PNG or WEBP · max 5 MB each</p>
      {!!files.length && (
        <div
          className={`mt-3 grid gap-3 ${multiple ? "grid-cols-2 sm:grid-cols-4" : "max-w-[10rem]"}`}
        >
          {files.map((f, i) => (
            <Preview
              key={f.name + i + f.size}
              file={f}
              onRemove={() => onChange(files.filter((_, j) => j !== i))}
            />
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
