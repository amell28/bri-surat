import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LogIn,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import briLogo from '../assets/BRI-Icon.png'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim()) {
      setError('Harap masukkan Personal Number (PN) atau Email BRI.')
      return
    }

    if (!password) {
      setError('Harap masukkan password Anda.')
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
    } catch (err) {
      setIsLoading(false)
      setError('Gagal menghubungkan ke database server.')
    }
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
          <div className="text-center mb-7 relative">
            <div className="inline-flex items-center justify-center mb-4">
              <img
                src={briLogo}
                alt="Logo BRI"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md hover:scale-105 transition-transform duration-200"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              KCP Iskandar Palembang
            </h1>
            <p className="text-xs text-[#FF7401] font-semibold mt-1 tracking-wide uppercase">
              Sistem Arsip & Penelusuran Surat Debitur
            </p>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] focus:border-transparent transition"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#014181] to-[#0256ab] hover:from-[#002d5b] hover:to-[#014181] text-white font-semibold text-sm shadow-lg shadow-[#014181]/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifikasi akun...</span>
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
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
