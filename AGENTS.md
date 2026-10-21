<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Backend uses Neon (DATABASE_URL) + private Vercel Blob via server routes in src/routes/api; no Supabase — user requirement for Vercel deployment.
- Admin auth is env-based credentials + HMAC cookie (src/lib/server/auth.server.js); never hardcode credentials.
