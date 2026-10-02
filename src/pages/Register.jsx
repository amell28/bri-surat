import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, User, Mail, Briefcase, Lock, ArrowLeft, Building2, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import briLogo from '../assets/BRI-Icon.png'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nama: '',
    pn: '',
    email: '',
    jabatan: 'Staff Administrasi Kredit',
    role: 'Staff',
    password: '',
    telepon: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.nama.trim() || !formData.email.trim()) {
      setError('Harap lengkapi nama dan email.')
      return
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password minimal 6 karakter (standar keamanan Supabase).')
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
    } catch (err) {
      setLoading(false)
      setError('Terjadi kendala saat registrasi ke Supabase.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-100 via-[#014181]/5 to-slate-200">
      {/* Decorative Top Accent */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#014181] via-[#0d5cb3] to-[#FF7401]"></div>

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#014181]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#014181] transition mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Login
            </Link>
            <div className="flex items-center gap-3.5">
              <img
                src={briLogo}
                alt="Logo BRI"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm shrink-0"
              />
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">
                  Daftar Akun Staf Baru
                </h1>
                <p className="text-xs text-[#FF7401] font-bold">
                  BRI KCP Iskandar Palembang
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap & Gelar *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181]"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Personal Number (PN BRI)
                </label>
                <input
                  type="text"
                  name="pn"
                  value={formData.pn}
                  onChange={handleChange}
                  placeholder="Contoh: 00192837"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Kantor / Resmi *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@bri.co.id"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181]"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Posisi
                </label>
                <select
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181]"
                >
                  <option value="Staff Administrasi Kredit">Staff Administrasi Kredit</option>
                  <option value="Mantri Unit / AO">Mantri Unit / AO</option>
                  <option value="Relationship Manager (RM)">Relationship Manager (RM)</option>
                  <option value="Supervisor Bisnis & Kredit">Supervisor Bisnis & Kredit</option>
                  <option value="Intern Staff (Magang)">Intern Staff (Magang)</option>
                  <option value="Admin Kredit & Arsip">Admin Kredit & Arsip</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Hak Akses
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181]"
                >
                  <option value="Staff">Staff </option>
                  <option value="Admin">Admin </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp / HP
              </label>
              <input
                type="text"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password Akun (Minimal 6 Karakter) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password aman"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181]"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
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
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#014181] to-[#0256ab] hover:from-[#002d5b] hover:to-[#014181] text-white font-semibold text-xs shadow-lg shadow-[#014181]/25 hover:shadow-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Mendaftarkan...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar & Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
