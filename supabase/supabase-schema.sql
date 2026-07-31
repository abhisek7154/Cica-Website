
create extension if not exists pgcrypto;

-- ============================================================
-- UPDATED AT FUNCTION
-- ============================================================

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

-- ============================================================
-- ADMIN USERS
-- ============================================================

create table if not exists public.admin_users (

    id uuid primary key default gen_random_uuid(),

    username text not null unique,

    password_hash text not null,

    full_name text,

    role text not null default 'admin',

    email text,

    phone text,

    avatar text,

    last_login timestamptz,

    is_active boolean not null default true,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now())

);

drop trigger if exists admin_users_updated_at
on public.admin_users;

create trigger admin_users_updated_at
before update
on public.admin_users
for each row
execute function public.update_updated_at_column();

-- ============================================================
-- HERO SETTINGS (Singleton)
-- ============================================================

create table if not exists public.hero_settings (

    id integer primary key default 1,

    school_name text not null,

    tagline text,

    subtitle text,

    primary_button_text text,

    primary_button_link text,

    secondary_button_text text,

    secondary_button_link text,

    overlay_opacity numeric(3,2) default 0.40,

    autoplay boolean default true,

    autoplay_speed integer default 5000,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now()),

    constraint hero_settings_single_row
    check(id=1)

);

drop trigger if exists hero_settings_updated_at
on public.hero_settings;

create trigger hero_settings_updated_at
before update
on public.hero_settings
for each row
execute function public.update_updated_at_column();

insert into public.hero_settings(

id,

school_name,

tagline,

subtitle,

primary_button_text,

primary_button_link,

secondary_button_text,

secondary_button_link

)

values(

1,

'DM Public School',

'Empowering Future Leaders',

'Admissions Open',

'Apply Now',

'/admission',

'Explore',

'/courses'

)

on conflict(id) do nothing;

-- ============================================================
-- HERO GALLERY
-- ============================================================

create table if not exists public.hero_gallery (

    id uuid primary key default gen_random_uuid(),

    title text,

    image_url text not null,

    alt_text text,

    display_order integer default 0,

    is_active boolean default true,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now())

);

drop trigger if exists hero_gallery_updated_at
on public.hero_gallery;

create trigger hero_gallery_updated_at
before update
on public.hero_gallery
for each row
execute function public.update_updated_at_column();

create index if not exists hero_gallery_order_idx
on public.hero_gallery(display_order);

create index if not exists hero_gallery_active_idx
on public.hero_gallery(is_active);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================

create table if not exists public.announcements (

    id uuid primary key default gen_random_uuid(),

    message text not null,

    display_order integer not null default 0,

    is_active boolean not null default true,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now())

);

drop trigger if exists announcements_updated_at
on public.announcements;

create trigger announcements_updated_at
before update
on public.announcements
for each row
execute function public.update_updated_at_column();

create index if not exists announcements_order_idx
on public.announcements(display_order);

create index if not exists announcements_active_idx
on public.announcements(is_active);

-- ============================================================
-- NOTICES
-- ============================================================

create table if not exists public.notices (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    description text not null,

    attachment_url text,

    published boolean not null default false,

    display_order integer not null default 0,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now())

);

drop trigger if exists notices_updated_at
on public.notices;

create trigger notices_updated_at
before update
on public.notices
for each row
execute function public.update_updated_at_column();

create index if not exists notices_published_idx
on public.notices(published);

create index if not exists notices_order_idx
on public.notices(display_order);

-- ============================================================
-- WEBSITE STATISTICS (Singleton)
-- ============================================================

create table if not exists public.statistics (

    id integer primary key default 1,

    courses integer not null default 15,

    enrolled integer not null default 850,

    passouts integer not null default 1200,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now()),

    constraint statistics_single_row
    check(id=1)

);

drop trigger if exists statistics_updated_at
on public.statistics;

create trigger statistics_updated_at
before update
on public.statistics
for each row
execute function public.update_updated_at_column();

insert into public.statistics(

id,

courses,

enrolled,

passouts

)

values(

1,

15,

850,

1200

)

on conflict(id) do nothing;

-- ============================================================
-- COURSES
-- ============================================================

create table if not exists public.courses (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    slug text unique,

    short_description text,

    description text,

    duration text,

    fees numeric(10,2),

    image_url text,

    brochure_url text,

    eligibility text,

    seats integer,

    display_order integer default 0,

    featured boolean default false,

    is_active boolean default true,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now())

);

drop trigger if exists courses_updated_at
on public.courses;

create trigger courses_updated_at
before update
on public.courses
for each row
execute function public.update_updated_at_column();

create index if not exists courses_active_idx
on public.courses(is_active);

create index if not exists courses_featured_idx
on public.courses(featured);

create index if not exists courses_order_idx
on public.courses(display_order);

create index if not exists courses_slug_idx
on public.courses(slug);

-- ============================================================
-- SAMPLE COURSES
-- ============================================================

insert into public.courses (

title,

slug,

short_description,

duration,

fees,

featured,

display_order

)

select

'Computer Applications',

'computer-applications',

'Professional computer application course.',

'12 Months',

15000,

true,

1

where not exists (

select 1

from public.courses

where slug='computer-applications'

);

insert into public.courses (

title,

slug,

short_description,

duration,

fees,

featured,

display_order

)

select

'Spoken English',

'spoken-english',

'English communication program.',

'6 Months',

8000,

true,

2

where not exists (

select 1

from public.courses

where slug='spoken-english'

);
-- ============================================================
-- DOCUMENTS
-- ============================================================

create table if not exists public.documents (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    description text,

    category text,

    file_url text not null,

    thumbnail_url text,

    file_size bigint,

    file_type text,

    display_order integer default 0,

    downloads integer default 0,

    is_active boolean default true,

    created_at timestamptz not null default timezone('utc', now()),

    updated_at timestamptz not null default timezone('utc', now())

);

drop trigger if exists documents_updated_at
on public.documents;

create trigger documents_updated_at
before update
on public.documents
for each row
execute function public.update_updated_at_column();

create index if not exists documents_category_idx
on public.documents(category);

create index if not exists documents_active_idx
on public.documents(is_active);

-- ============================================================
-- CONTACT DETAILS (Singleton)
-- ============================================================

create table if not exists public.contact_details (

    id integer primary key default 1,

    school_name text,

    address text,

    city text,

    state text,

    postal_code text,

    phone text,

    alternate_phone text,

    email text,

    website text,

    facebook text,

    instagram text,

    youtube text,

    whatsapp text,

    google_map_embed text,

    office_hours text,

    latitude numeric,

    longitude numeric,

    created_at timestamptz default timezone('utc', now()),

    updated_at timestamptz default timezone('utc', now()),

    constraint contact_single_row check(id=1)

);

drop trigger if exists contact_updated_at
on public.contact_details;

create trigger contact_updated_at
before update
on public.contact_details
for each row
execute function public.update_updated_at_column();

insert into public.contact_details(id,school_name)
values(1,'DM Public School')
on conflict(id) do nothing;

-- ============================================================
-- SITE SETTINGS (Singleton)
-- ============================================================

create table if not exists public.site_settings (

    id integer primary key default 1,

    school_logo text,

    favicon text,

    footer_text text,

    copyright_text text,

    theme_color text default '#2563eb',

    maintenance_mode boolean default false,

    admission_open boolean default true,

    announcement_bar text,

    created_at timestamptz default timezone('utc', now()),

    updated_at timestamptz default timezone('utc', now()),

    constraint settings_single_row check(id=1)

);

drop trigger if exists settings_updated_at
on public.site_settings;

create trigger settings_updated_at
before update
on public.site_settings
for each row
execute function public.update_updated_at_column();

insert into public.site_settings(id)
values(1)
on conflict(id) do nothing;

-- ============================================================
-- AUDIT LOGS
-- ============================================================

create table if not exists public.audit_logs (

    id uuid primary key default gen_random_uuid(),

    admin_id uuid references public.admin_users(id),

    action text not null,

    table_name text,

    record_id text,

    details jsonb,

    ip_address text,

    user_agent text,

    created_at timestamptz default timezone('utc', now())

);

create index if not exists audit_admin_idx
on public.audit_logs(admin_id);

create index if not exists audit_created_idx
on public.audit_logs(created_at desc);

-- ============================================================
-- ENABLE RLS
-- ============================================================

alter table public.admin_users enable row level security;
alter table public.hero_settings enable row level security;
alter table public.hero_gallery enable row level security;
alter table public.announcements enable row level security;
alter table public.notices enable row level security;
alter table public.statistics enable row level security;
alter table public.courses enable row level security;
alter table public.documents enable row level security;
alter table public.contact_details enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

-- ============================================================
-- PUBLIC READ POLICIES
-- ============================================================

create policy "public_read_hero_settings"
on public.hero_settings
for select
using (true);

create policy "public_read_hero_gallery"
on public.hero_gallery
for select
using (true);

create policy "public_read_announcements"
on public.announcements
for select
using (is_active = true);

create policy "public_read_notices"
on public.notices
for select
using (published = true);

create policy "public_read_statistics"
on public.statistics
for select
using (true);

create policy "public_read_courses"
on public.courses
for select
using (is_active = true);

create policy "public_read_documents"
on public.documents
for select
using (is_active = true);

create policy "public_read_contact"
on public.contact_details
for select
using (true);

create policy "public_read_settings"
on public.site_settings
for select
using (true);

-- ============================================================
-- NOTE
-- ============================================================
-- Admin write access should be performed using your server-side
-- API routes with the Supabase Service Role key.
-- Do not expose write permissions directly to the browser.
