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
  category        text not null check (category in (
    'social-media-superstar','viral-content-champion','most-creative-creator','consistency-champion',
    'educational-content-creator','rising-star-creator','ugc-creator','ai-creative-genius','ai-powered-personal-creator')),
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

create index if not exists applications_category_idx on applications (category);
create index if not exists applications_status_idx on applications (status);
create index if not exists applications_created_idx on applications (created_at desc);
