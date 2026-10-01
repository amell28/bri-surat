// Data pengguna staf & admin BRI KCP Iskandar Palembang
// Password default '123456' tersimpan dalam format hash SHA-256 aman
const DEFAULT_HASHED_PASSWORD = '7462f61e6db735d2a8f2fbf18265e634d7483c18533ef994065cb65eb7ac6b8a'

export const initialUsersList = [
  {
    id: 'USR-001',
    nama: 'M. Rizky Pratama',
    pn: '00192847', // Personal Number BRI
    email: 'rizky.pratama@bri.co.id',
    jabatan: 'Admin Kredit & Arsip',
    role: 'Admin',
    unit: 'KCP Iskandar Palembang',
    password: DEFAULT_HASHED_PASSWORD,
    status: 'Aktif',
    avatar: null,
    telepon: '0812-7382-9901'
  },
  {
    id: 'USR-002',
    nama: 'Ahmad Fauzan, S.E.',
    pn: '00154829',
    email: 'ahmad.fauzan@bri.co.id',
    jabatan: 'Supervisor Bisnis & Kredit',
    role: 'Supervisor',
    unit: 'KCP Iskandar Palembang',
    password: DEFAULT_HASHED_PASSWORD,
    status: 'Aktif',
    avatar: null,
    telepon: '0813-6490-1123'
  },
  {
    id: 'USR-003',
    nama: 'Siti Rahmawati',
    pn: '00219483',
    email: 'siti.rahmawati@bri.co.id',
    jabatan: 'Mantri Unit / AO',
    role: 'Staff',
    unit: 'KCP Iskandar Palembang',
    password: DEFAULT_HASHED_PASSWORD,
    status: 'Aktif',
    avatar: null,
    telepon: '0821-8930-4412'
  },
  {
    id: 'USR-004',
    nama: 'Bambang Supriyadi',
    pn: '00183742',
    email: 'bambang.supriyadi@bri.co.id',
    jabatan: 'Relationship Manager (RM)',
    role: 'Staff',
    unit: 'KCP Iskandar Palembang',
    password: DEFAULT_HASHED_PASSWORD,
    status: 'Aktif',
    avatar: null,
    telepon: '0812-4455-8899'
  },
  {
    id: 'USR-005',
    nama: 'Mahasiswa Magang (Anda)',
    pn: 'MAGANG-501',
    email: 'magang.iskandar@bri.co.id',
    jabatan: 'Intern Staff Administrasi Kredit',
    role: 'Admin',
    unit: 'KCP Iskandar Palembang',
    password: DEFAULT_HASHED_PASSWORD,
    status: 'Aktif',
    avatar: null,
    telepon: '0896-1234-5678'
  }
]
