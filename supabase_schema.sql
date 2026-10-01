-- =========================================================================
-- SQL SCHEMA TABEL SURAT DEBITUR BRI KCP ISKANDAR PALEMBANG
-- Salin (copy) dan jalankan (run) seluruh perintah ini di SQL Editor Supabase Anda:
-- =========================================================================

-- 1. Buat Tabel surat_debitur
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
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.surat_debitur enable row level security;

-- 3. Beri Izin Akses Penuh (SELECT, INSERT, UPDATE, DELETE) untuk Publik / Anon Key (Khusus Demo Magang)
drop policy if exists "Izin Akses Penuh untuk Staf KCP" on public.surat_debitur;

create policy "Izin Akses Penuh untuk Staf KCP" 
on public.surat_debitur 
for all 
using (true) 
with check (true);

-- Selesai! Tabel siap digunakan oleh aplikasi web BRI KCP Iskandar.
