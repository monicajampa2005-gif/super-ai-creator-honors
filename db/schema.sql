-- Super AI Creator Excellence Awards 2026 — run once in your Neon SQL editor.
create extension if not exists pgcrypto;

create table if not exists applications (
  id              uuid primary key default gen_random_uuid(),
  reference_no    text not null unique,
  full_name       text not null,
  phone           text not null,
  email           text not null,
  city            text not null,
  state           text not null,
  pincode         char(6) not null,
  profile_link    text not null,
  category        jsonb not null default '[]',  -- array of selected category IDs
  content_link_1  text not null,
  content_link_2  text not null,
  content_link_3  text not null,
  profile_image   text not null,            -- private Vercel Blob pathname
  screenshots     jsonb not null default '[]', -- array of private Blob pathnames
  consent         boolean not null default false,
  status          text not null default 'Pending' check (status in ('Pending','Under Review','Shortlisted','Selected','Rejected')),
  reviewer_notes  text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists applications_status_idx on applications (status);
create index if not exists applications_created_idx on applications (created_at desc);

-- If upgrading an existing table, run this to change the category column:
-- alter table applications alter column category type jsonb using to_jsonb(array[category]);
-- drop index if exists applications_category_idx;
