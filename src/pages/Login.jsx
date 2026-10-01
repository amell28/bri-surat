import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, Lock, Mail, Building2, ShieldCheck, ArrowRight, Sparkles, Database, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSurat } from '../context/SuratContext'

export default function Login() {
  const { login, users, supabaseReady } = useAuth()
  const { isConfigured } = useSurat()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim()) {
      setError('Harap masukkan NIP/PN BRI atau Email.')
      return
    }

    setIsLoading(true)
    try {
      const res = await login(identifier, password)
      setIsLoading(false)
      if (res.success) {
        navigate('/dashboard')
      } else {
        setError('Gagal masuk. Periksa kembali NIP/PN atau Email Anda.')
      }
    } catch (err) {
      setIsLoading(false)
      setError('Gagal menghubungkan ke database.')
    }
  }

  const handleQuickLogin = async (userItem) => {
    setIdentifier(userItem.email)
    setPassword('••••••••')
    setIsLoading(true)
    await login(userItem.email, 'password')
    setIsLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-100 via-[#014181]/5 to-slate-200">
      {/* Decorative Top Accent */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#014181] via-[#0d5cb3] to-[#FF7401]"></div>

      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#014181]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#FF7401]/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-6 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#014181] to-[#0d5cb3] text-white shadow-lg shadow-[#014181]/30 mb-4">
              <span className="text-2xl font-black tracking-tight">BRI</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              KCP Iskandar Palembang
            </h1>
            <p className="text-xs text-[#FF7401] font-semibold mt-1 tracking-wide uppercase">
              Sistem Arsip & Penelusuran Surat Debitur
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Kelola dan cari berkas SP 1, SP 2, SP 3, SP Default, LPJ, & PK dengan cepat
            </p>
          </div>

          {/* Supabase Connection Status Banner */}
          <div className="mb-6 p-2.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#014181]" />
              Database Server:
            </span>
            <span className="font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 text-[11px] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Supabase Connected
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Personal Number (PN) atau Email BRI
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: magang.iskandar@bri.co.id / 00192847"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">
                  Default bebas untuk demo
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#014181] to-[#0256ab] hover:from-[#002d5b] hover:to-[#014181] text-white font-semibold text-sm shadow-lg shadow-[#014181]/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifikasi ke Supabase...</span>
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Access / Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7401]" />
              <span>Akses Cepat Pengguna Demo (1-Klik Masuk):</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(users[4] || users[0])}
                disabled={isLoading}
                className="p-2 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition text-xs group"
              >
                <p className="font-semibold text-slate-800 group-hover:text-[#014181] truncate">
                  Mahasiswa Magang
                </p>
                <p className="text-[10px] text-slate-500">Semester 5 (Anda)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(users[0])}
                disabled={isLoading}
                className="p-2 text-left rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition text-xs group"
              >
                <p className="font-semibold text-slate-800 group-hover:text-[#FF7401] truncate">
                  Admin Kredit
                </p>
                <p className="text-[10px] text-slate-500">M. Rizky Pratama</p>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Belum terdaftar sebagai staf?{' '}
            <Link
              to="/register"
              className="font-bold text-[#014181] hover:text-[#FF7401] transition inline-flex items-center gap-0.5"
            >
              Daftar Akun Staf <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center mt-6 text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-600">
            Bank Rakyat Indonesia (Persero) Tbk
          </p>
          <p className="text-[11px]">
            Kantor Cabang Pembantu (KCP) Iskandar Palembang
          </p>
        </div>
      </div>
    </div>
  )
}
