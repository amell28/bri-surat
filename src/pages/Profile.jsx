import { useState } from 'react'
import {
  User,
  Save,
  Check,
  Lock,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { hashPassword } from '../lib/crypto'

export default function Profile() {
  const { user, updateProfile } = useAuth()

  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    jabatan: user?.jabatan || '',
    telepon: user?.telepon || '',
    pn: user?.pn || ''
  })
  const [successMsg, setSuccessMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setSuccessMsg('Profil berhasil diperbarui!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword.trim() || newPassword.length < 6) {
      alert('Password baru minimal 6 karakter.')
      return
    }
    const encrypted = await hashPassword(newPassword.trim())
    await updateProfile({ password: encrypted })
    setPasswordMsg('Password baru berhasil disimpan dan terenkripsi SHA-256!')
    setNewPassword('')
    setTimeout(() => setPasswordMsg(''), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-[#014181] via-[#0256ab] to-[#01356b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.nama}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="text-center sm:text-left min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF7401] text-[11px] font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>{user?.role || 'Staff'} • {user?.jabatan || 'Administrasi'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate">
              {user?.nama || 'Pengguna BRI'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
              Personal Number (PN): <strong className="text-white">{user?.pn || '-'}</strong> • Unit: BRI KCP Iskandar Palembang
            </p>
          </div>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FF7401]/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Forms: Edit Profile & Keamanan */}
      <div className="space-y-6">
        {/* Informasi Biodata Staf */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-[#014181]" />
            Informasi Biodata Staf
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Perbarui data kontak dan rincian jabatan Anda
          </p>

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Personal Number (PN)
                </label>
                <input
                  type="text"
                  value={formData.pn}
                  onChange={(e) => setFormData({ ...formData, pn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Kantor
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jabatan / Posisi
                </label>
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor WhatsApp / HP
                </label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#014181] hover:bg-[#002d5b] text-white font-bold text-xs shadow-md shadow-[#014181]/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Ganti Password */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#FF7401]" />
            Keamanan & Kata Sandi
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Ganti password akun login portal arsip Anda
          </p>

          {passwordMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              {passwordMsg}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Password Baru
              </label>
              <input
                type="password"
                placeholder="Masukkan password baru (minimal 6 karakter)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none transition"
              />
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#FF7401] hover:bg-[#e06500] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Ubah Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
