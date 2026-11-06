import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserPlus,
  User,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Phone,
  Briefcase,
  BadgeCheck,
  ArrowRight,
  ShieldAlert,
  Check
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import briLogo from '../assets/BRI-Icon.png'

export default function Register() {
  const { register, loginAsGuest } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nama: '',
    pn: '',
    email: '',
    jabatan: 'Staff Administrasi Kredit',
    role: 'Admin',
    password: '',
    telepon: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isGuestStarting, setIsGuestStarting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole })
  }

  // Quick 1-click guest bypass from register
  const handleInstantGuest = (roleChoice = 'User') => {
    setIsGuestStarting(true)
    setError('')
    try {
      setTimeout(() => {
        loginAsGuest(roleChoice)
        navigate('/dashboard')
      }, 350)
    } catch {
      setIsGuestStarting(false)
      setError('Gagal memulai sesi tamu.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.nama.trim() || !formData.email.trim()) {
      setError('Harap lengkapi nama lengkap dan email resmi.')
      return
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password minimal 6 karakter sesuai standar keamanan akun BRI.')
      return
    }

    setLoading(true)
    try {
      const res = await register(formData)
      setLoading(false)
      if (res.success) {
        navigate('/dashboard')
      } else {
        setError(res.message || 'Gagal mendaftar. Silakan coba kembali.')
      }
    } catch {
      setLoading(false)
      setError('Terjadi kendala saat mendaftarkan akun ke Supabase.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Ambient Gradient Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#014181]/40 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FF7401]/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      {/* Decorative Top Accent Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#014181] via-[#0d5cb3] via-sky-400 to-[#FF7401] z-50"></div>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-[32px] shadow-2xl border border-white/40 overflow-hidden relative z-10 animate-scale-in">
        
        {/* Guest Instant Pass Header Callout */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-blue-500/10 border-b border-orange-200/60 px-5 py-3 sm:px-8 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
           
            <span>
              Hanya ingin meninjau atau evaluasi sistem?{' '}
              <strong className="text-slate-900 font-bold">Tidak perlu daftar akun!</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleInstantGuest('User')}
            disabled={isGuestStarting}
            className="shrink-0 text-xs font-bold text-white bg-gradient-to-r from-[#FF7401] to-[#e06500] hover:from-[#e06500] hover:to-[#c85500] px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            {isGuestStarting ? (
              <span>Membuka Akses Tamu...</span>
            ) : (
              <>
                <span>Masuk sebagai Tamu Langsung</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-9 lg:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
            <div>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#014181] transition mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Login
              </Link>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Registrasi Akun Staf Baru
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pendaftaran resmi staf operasional & pengelola arsip kredit BRI KCP Iskandar Palembang.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 shadow-2xs flex items-center justify-center shrink-0">
                <img
                  src={briLogo}
                  alt="Logo BRI"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-[#014181]">BRI KCP Iskandar</span>
                <span className="block text-[10px] text-slate-400">Portal Arsip Debitur</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap & Gelar Staf *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Muhammad Farhan Pratama, S.E."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* 2. Personal Number & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Personal Number (PN BRI)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="pn"
                    value={formData.pn}
                    onChange={handleChange}
                    placeholder="Contoh: 00192837 (opsional)"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                  />
                  <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Kantor / Resmi *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama.staf@bri.co.id"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* 3. Visual Interactive Role Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700">
                  Pilih Tingkat Akses (Role Akun) *
                </label>
                <span className="text-[11px] text-slate-400">
                  Dapat disesuaikan oleh Sisadmin kapan saja
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Admin Role */}
                <div
                  onClick={() => handleRoleSelect('Admin')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    formData.role === 'Admin'
                      ? 'border-[#FF7401] bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-[#FF7401]" />
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          formData.role === 'Admin'
                            ? 'bg-[#FF7401] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Direkomendasikan
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Admin (Operasional)
                    </h5>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#FF7401]">
                    {formData.role === 'Admin' ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Dipilih
                      </span>
                    ) : (
                      'Pilih Admin'
                    )}
                  </div>
                </div>

                {/* Sisadmin Role */}
                <div
                  onClick={() => handleRoleSelect('Sisadmin')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    formData.role === 'Sisadmin'
                      ? 'border-[#014181] bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-[#014181]" />
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          formData.role === 'Sisadmin'
                            ? 'bg-[#014181] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Akses Penuh
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Sisadmin (Pengelola)
                    </h5>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#014181]">
                    {formData.role === 'Sisadmin' ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Dipilih
                      </span>
                    ) : (
                      'Pilih Sisadmin'
                    )}
                  </div>
                </div>

                {/* User Read-Only Role */}
                <div
                  onClick={() => handleRoleSelect('User')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    formData.role === 'User'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-emerald-700" />
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          formData.role === 'User'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Read-Only
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">
                      User / Peninjau (Tamu)
                    </h5>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    {formData.role === 'User' ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Dipilih
                      </span>
                    ) : (
                      'Pilih Peninjau'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Jabatan & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jabatan / Posisi Penugasan
                </label>
                <div className="relative">
                  <select
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                  >
                    <option value="Staff Administrasi Kredit">Staff Administrasi Kredit</option>
                    <option value="Mantri Unit / AO">Mantri Unit / AO</option>
                    <option value="Relationship Manager (RM)">Relationship Manager (RM)</option>
                    <option value="Supervisor Bisnis & Kredit">Supervisor Bisnis & Kredit</option>
                    <option value="Intern Staff (Magang)">Intern Staff (Magang)</option>
                    <option value="Admin Kredit & Arsip">Admin Kredit & Arsip</option>
                    <option value="Peninjau Tamu / Auditor">Peninjau Tamu / Auditor</option>
                  </select>
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor WhatsApp / Kontak Staf
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* 5. Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password Akun Staf *
                </label>
                <span className="text-[11px] text-slate-400">
                  Minimal 6 karakter terenkripsi SHA-256
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Buat password yang aman (min. 6 karakter)"
                  className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#014181] via-[#0256ab] to-[#014181] hover:from-[#002850] hover:to-[#014181] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#014181]/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Mendaftarkan Akun ke Database Supabase...</span>
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan Akun Staf Sekarang</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Sudah memiliki akun terdaftar?{' '}
              <Link
                to="/login"
                className="font-bold text-[#014181] hover:text-[#FF7401] transition inline-flex items-center gap-0.5"
              >
                Login di sini &rarr;
              </Link>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>KCP Iskandar Palembang</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
