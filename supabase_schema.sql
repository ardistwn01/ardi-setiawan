-- ============================================================
-- JALANKAN SEMUA INI DI SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → paste → Run
-- ============================================================

-- Profile
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Ardi',
  title text not null default 'Informatics Engineering Student',
  bio text default '',
  email text default '',
  github_url text default '',
  linkedin_url text default '',
  instagram_url text default '',
  avatar_url text default '',
  cv_url text default '',
  location text default 'Bekasi, Indonesia',
  updated_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  tech_stack text[] default '{}',
  live_url text default '',
  github_url text default '',
  image_url text default '',
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Experience
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  description text default '',
  start_date text not null,
  end_date text default 'Sekarang',
  is_current boolean default false,
  tech_stack text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Certificates
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date text not null,
  credential_url text default '',
  image_url text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Skills
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  level int default 80,
  sort_order int default 0
);

-- Messages (from contact form)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default '',
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profile enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;
alter table certificates enable row level security;
alter table skills enable row level security;
alter table messages enable row level security;

-- Public: boleh baca semua kecuali messages
create policy "public read profile" on profile for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read experience" on experience for select using (true);
create policy "public read certificates" on certificates for select using (true);
create policy "public read skills" on skills for select using (true);

-- Public: boleh kirim pesan
create policy "public insert messages" on messages for insert with check (true);

-- Admin: full akses (authenticated user)
create policy "admin all profile" on profile for all using (auth.role() = 'authenticated');
create policy "admin all projects" on projects for all using (auth.role() = 'authenticated');
create policy "admin all experience" on experience for all using (auth.role() = 'authenticated');
create policy "admin all certificates" on certificates for all using (auth.role() = 'authenticated');
create policy "admin all skills" on skills for all using (auth.role() = 'authenticated');
create policy "admin read messages" on messages for select using (auth.role() = 'authenticated');
create policy "admin update messages" on messages for update using (auth.role() = 'authenticated');
create policy "admin delete messages" on messages for delete using (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA AWAL
-- ============================================================

insert into profile (name, title, bio, email, github_url, linkedin_url, location)
values (
  'Ardi',
  'Informatics Engineering Student',
  'Mahasiswa Teknik Informatika UHAMKA yang passionate di bidang full-stack web development, AI/ML, dan mobile app. Suka membangun solusi nyata dari masalah nyata.',
  'ardi@email.com',
  'https://github.com/yourusername',
  'https://linkedin.com/in/yourusername',
  'Bekasi, Indonesia'
) on conflict do nothing;

insert into skills (category, name, level, sort_order) values
('Frontend', 'HTML/CSS/JS', 90, 1),
('Frontend', 'React', 75, 2),
('Backend', 'Node.js / Express', 80, 3),
('Backend', 'Python / Flask', 75, 4),
('Database', 'MySQL / PostgreSQL', 80, 5),
('Database', 'Supabase', 70, 6),
('Mobile', 'React Native', 60, 7),
('AI/ML', 'Sentence Transformers', 65, 8),
('Tools', 'Git / GitHub', 85, 9),
('Tools', 'Vercel / Railway', 75, 10);

insert into experience (company, role, description, start_date, end_date, is_current, tech_stack, sort_order) values
(
  'BPTI UHAMKA',
  'PKL — AI FAQ Chatbot Developer',
  'Membangun UHAMKA Virtual Assistant, chatbot FAQ berbasis AI menggunakan Sentence Transformers dan PostgreSQL. Mencakup pengembangan backend Flask, frontend HTML/CSS/JS, dan deployment.',
  'November 2024',
  'Februari 2025',
  false,
  ARRAY['Python', 'Flask', 'Sentence Transformers', 'PostgreSQL', 'HTML/CSS/JS'],
  1
);

insert into projects (title, description, tech_stack, live_url, github_url, featured, sort_order) values
(
  'UHAMKA Virtual Assistant',
  'Chatbot FAQ berbasis AI untuk lingkungan kampus UHAMKA. Menggunakan Sentence Transformers untuk semantic search dan PostgreSQL sebagai knowledge base.',
  ARRAY['Python', 'Flask', 'Sentence Transformers', 'PostgreSQL', 'JavaScript'],
  '',
  'https://github.com/yourusername',
  true,
  1
),
(
  'ZuppaZuppa Restaurant',
  'Website restoran full-stack dengan sistem manajemen konten (CMS), autentikasi JWT, role-based access, dan manajemen menu lengkap.',
  ARRAY['Node.js', 'Express', 'MySQL', 'JWT', 'HTML/CSS/JS'],
  'https://zuppazuppa.vercel.app',
  'https://github.com/yourusername',
  true,
  2
),
(
  'Finance Tracker Bot',
  'Telegram bot berbasis AI untuk pencatatan keuangan otomatis. Menggunakan Gemini API untuk parsing natural language dan Google Sheets sebagai database.',
  ARRAY['Python', 'Flask', 'Gemini API', 'Google Sheets', 'Telegram Bot API'],
  '',
  'https://github.com/yourusername',
  false,
  3
);
