import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LogIn,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  FileText,
  Zap,
  CheckCircle2,
  Building2,
  ShieldAlert
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import briLogo from '../assets/BRI-Icon.png'

export default function Login() {
  const { login, loginAsGuest } = useAuth()
  const navigate = useNavigate()

  // Tab mode: 'guest' (default for quick evaluation) | 'staff' (credentials login)
  const [activeTab, setActiveTab] = useState('guest')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [guestLoadingRole, setGuestLoadingRole] = useState(null)

  // Quick guest login handler
  const handleGuestLogin = (role = 'User') => {
    setGuestLoadingRole(role)
    setError('')
    try {
      setTimeout(() => {
        loginAsGuest(role)
        navigate('/dashboard')
      }, 400)
    } catch {
      setGuestLoadingRole(null)
      setError('Gagal memulai sesi tamu. Silakan coba kembali.')
    }
  }

  // Quick fill staff demo credentials
  const fillStaffDemo = (email, pass) => {
    setActiveTab('staff')
    setIdentifier(email)
    setPassword(pass)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim()) {
      setError('Harap masukkan Personal Number (PN) atau Email BRI.')
      return
    }

    if (!password) {
      setError('Harap masukkan password akun Anda.')
      return
    }

    setIsLoading(true)
    try {
      const res = await login(identifier, password)
      setIsLoading(false)
      if (res.success) {
        navigate('/dashboard')
      } else {
        setError(res.message || 'Gagal masuk. Periksa kembali NIP/PN atau Email Anda.')
      }
    } catch {
      setIsLoading(false)
      setError('Gagal menghubungkan ke database server.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Decorative Gradient Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#014181]/40 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF7401]/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Decorative Top Accent Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#014181] via-[#0d5cb3] via-sky-400 to-[#FF7401] z-50"></div>

      {/* Master Card Container */}
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-[32px] shadow-2xl border border-white/40 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 animate-scale-in">

        {/* ========================================================
            LEFT COLUMN: BRAND SHOWCASE & SYSTEM HIGHLIGHTS
            ======================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#002850] via-[#014181] to-[#0a5299] text-white p-7 sm:p-9 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Background Circles */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-[#FF7401]/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top: Header & Identity */}
          <div className="relative z-10">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-inner flex items-center justify-center shrink-0">
                <img
                  src={briLogo}
                  alt="Logo BRI"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FF7401] text-white shadow-xs">
                 Portal Arsip 
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight leading-snug mt-1">
                  BRI KCP Iskandar
                </h2>
                <p className="text-[11px] text-blue-200">
                  Kantor Cabang Pembantu Palembang
                </p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Sistem Penatausahaan & Penelusuran Surat Debitur
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-2.5 leading-relaxed">
              Platform modern pengelolaan arsip digital surat peringatan (SP1 s.d. SP3), perjanjian kredit, dan verifikasi fisik jaminan.
            </p>

            {/* Live Workflow & System Insight Card */}
            <div className="mt-7 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Alur Penanganan Surat Peringatan
                </span>
                <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
                  SOP Standar
                </span>
              </div>

              {/* Step progression */}
              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <span className="block text-[11px] font-extrabold text-sky-300">SP 1</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <span className="block text-[11px] font-extrabold text-blue-200">SP 2</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <span className="block text-[11px] font-extrabold text-amber-300">SP 3</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <span className="block text-[11px] font-extrabold text-rose-300">Default</span>
                </div>
              </div>

              {/* Metric overview */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-blue-200 leading-none">Kelengkapan</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">LPJ & PK Fisik</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-blue-200 leading-none">Kerahasiaan</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">Audit Log Bank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Seal */}
          <div className="mt-8 pt-5 border-t border-white/15 relative z-10 flex items-center justify-between text-[11px] text-blue-200/80">
            <span className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-amber-300" /> PT Bank Rakyat Indonesia (Persero) Tbk
            </span>
            <span className="font-semibold text-[#FF7401]">v2.6.0</span>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: INTERACTIVE AUTH & GUEST ONBOARDING
            ======================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-9 lg:p-11 flex flex-col justify-between bg-white/80">
          <div>
            {/* Top Switcher Segment */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Pintu Masuk Sistem
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gunakan mode tamu untuk peninjauan instan atau login akun staf.
                </p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('guest')
                    setError('')
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === 'guest'
                      ? 'bg-gradient-to-r from-[#FF7401] to-[#e06500] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  
                  <span>Mode Tamu</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('staff')
                    setError('')
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === 'staff'
                      ? 'bg-[#014181] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Akun Staf</span>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ==============================================
                TAB 1: GUEST / DEMO EXPERIENCE (TRENDY & INSTANT)
                ============================================== */}
            {activeTab === 'guest' ? (
              <div className="space-y-4">
                {/* VIP Guest Hero Box */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-blue-50/50 border border-orange-200/80 p-5 shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-[#FF7401] bg-orange-100/90 px-2 py-0.5 rounded-full mb-1.5">
                      Akses Seketika (Tanpa Daftar)
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        Jelajahi Sistem Sebagai Tamu / Peninjau
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Dirancang khusus untuk dosen penguji, penilai magang, recruiter, atau tamu yang ingin melihat seluruh data arsip tanpa registrasi.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGuestLogin('User')}
                    disabled={guestLoadingRole !== null}
                    className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF7401] via-[#ff8826] to-[#e06500] hover:from-[#e06500] hover:to-[#c85500] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {guestLoadingRole === 'User' ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Membuka Akses Tamu...</span>
                      </span>
                    ) : (
                      <>
                        <span>Masuk Instan sebagai Tamu Peninjau</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Switch to Staff Form Tip */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  Punya akun resmi staf BRI?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('staff')}
                    className="font-bold text-[#014181] hover:text-[#FF7401] transition inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    Login dengan PN / Email &rarr;
                  </button>
                </div>
              </div>
            ) : (
              /* ==============================================
                 TAB 2: REGISTERED STAFF CREDENTIALS FORM
                 ============================================== */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Personal Number (PN) atau Email Resmi BRI
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Contoh: magang.iskandar@bri.co.id atau 00192847"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password Akun
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password Anda"
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

                {/* Auto-fill Preset Pills for Testing */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Isi Cepat Akun Demo :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => fillStaffDemo('magang.iskandar@bri.co.id', '123456')}
                      className="text-[10px] font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-[#014181] border border-slate-200 px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      Sisadmin 
                    </button>
                    <button
                      type="button"
                      onClick={() => fillStaffDemo('siti.rahmawati@bri.co.id', '123456')}
                      className="text-[10px] font-semibold bg-white hover:bg-orange-50 text-slate-700 hover:text-[#FF7401] border border-slate-200 px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      Admin 
                    </button>
                    <button
                      type="button"
                      onClick={() => fillStaffDemo('user@bri.co.id', '123456')}
                      className="text-[10px] font-semibold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      User  
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#014181] via-[#0256ab] to-[#014181] hover:from-[#002850] hover:to-[#014181] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#014181]/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Memverifikasi Sandi SHA-256...</span>
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk ke Dashboard</span>
                    </>
                  )}
                </button>

                {/* Bottom Link to Register */}
                <div className="pt-3 text-center text-xs text-slate-500">
                  Belum memiliki akun staf resmi?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-[#014181] hover:text-[#FF7401] transition inline-flex items-center gap-0.5"
                  >
                    Daftar Akun Baru <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Footer Security Badges */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Standar Keamanan Data Perbankan BRI
            </span>
            <span>KCP Iskandar Palembang</span>
          </div>
        </div>

      </div>
    </div>
  )
}
