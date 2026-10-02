-- =========================================================================
-- SQL SCHEMA LENGKAP: TABEL SURAT & STAF PENGGUNA BRI KCP ISKANDAR
-- Salin dan jalankan seluruh script ini di SQL Editor Supabase Anda:
-- =========================================================================

-- JIKA TABEL SUDAH PERNAH DIBUAT SEBELUMNYA, JALANKAN MIGRATION INI TERLEBIH DAHULU:
alter table public.surat_debitur 
  add column if not exists lampiran jsonb default '[]'::jsonb,
  add column if not exists riwayat_log jsonb default '[]'::jsonb,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()),
  add column if not exists updated_by text default 'Staf BRI';

-- 1. Tabel surat_debitur (Baru)
create table if not exists public.surat_debitur (
  id text primary key,
  nama text not null,
  tahun text not null,
  sp1 text default '-',
  sp1_urgent boolean default false,
  sp2 text default '-',
  sp2_urgent boolean default false,
  sp3 text default '-',
  sp3_urgent boolean default false,
  sp_default text default '-',
  sp_default_urgent boolean default false,
  lpj text default '-',
  lpj_urgent boolean default false,
  pk text default '-',
  pk_urgent boolean default false,
  status text default 'Lengkap / Normal',
  catatan text,
  lampiran jsonb default '[]'::jsonb,
  riwayat_log jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  updated_by text default 'Staf BRI',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tabel staf_pengguna (Untuk Autentikasi Staf KCP)
-- Kolom password menyimpan string hash kriptografi SHA-256 (64 karakter)
create table if not exists public.staf_pengguna (
  id text primary key,
  nama text not null,
  pn text not null unique,
  email text not null unique,
  jabatan text,
  role text default 'Staff',
  unit text default 'KCP Iskandar Palembang',
  password text default '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a',
  status text default 'Aktif',
  telepon text,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Aktifkan Row Level Security (RLS) & Buka Izin Akses
alter table public.surat_debitur enable row level security;
alter table public.staf_pengguna enable row level security;

drop policy if exists "Akses Staf KCP Surat" on public.surat_debitur;
create policy "Akses Staf KCP Surat" on public.surat_debitur for all using (true) with check (true);

drop policy if exists "Akses Staf KCP User" on public.staf_pengguna;
create policy "Akses Staf KCP User" on public.staf_pengguna for all using (true) with check (true);

-- 4. Masukkan Akun Staf Standar KCP Iskandar ke Supabase (Password Terenkripsi SHA-256)
-- Hash '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a' adalah enkripsi dari '123456' + secret salt
insert into public.staf_pengguna (id, nama, pn, email, jabatan, role, unit, password, status, telepon, avatar)
values 
  ('USR-005', 'Mahasiswa Magang (Anda)', 'MAGANG-501', 'magang.iskandar@bri.co.id', 'Intern Staff Administrasi Kredit', 'Admin', 'KCP Iskandar Palembang', '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a', 'Aktif', '0896-1234-5678', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
  ('USR-001', 'M. Rizky Pratama', '00192847', 'rizky.pratama@bri.co.id', 'Admin Kredit & Arsip', 'Admin', 'KCP Iskandar Palembang', '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a', 'Aktif', '0812-7382-9901', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('USR-002', 'Ahmad Fauzan, S.E.', '00154829', 'ahmad.fauzan@bri.co.id', 'Supervisor Bisnis & Kredit', 'Supervisor', 'KCP Iskandar Palembang', '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a', 'Aktif', '0813-6490-1123', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('USR-003', 'Siti Rahmawati', '00219483', 'siti.rahmawati@bri.co.id', 'Mantri Unit / AO', 'Staff', 'KCP Iskandar Palembang', '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a', 'Aktif', '0821-8930-4412', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
  ('USR-004', 'Bambang Supriyadi', '00183742', 'bambang.supriyadi@bri.co.id', 'Relationship Manager (RM)', 'Staff', 'KCP Iskandar Palembang', '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a', 'Aktif', '0812-4455-8899', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150')
on conflict (id) do nothing;

-- 5. Bucket Supabase Storage untuk Berkas Fisik (PDF / Scan Dokumen)
insert into storage.buckets (id, name, public) 
values ('berkas_debitur', 'berkas_debitur', true) 
on conflict (id) do nothing;

drop policy if exists "Akses Berkas Debitur Public" on storage.objects;
create policy "Akses Berkas Debitur Public" on storage.objects 
for all using (bucket_id = 'berkas_debitur') with check (bucket_id = 'berkas_debitur');
