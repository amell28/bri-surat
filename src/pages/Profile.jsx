import { useState } from 'react'
import {
  User,
  Save,
  Check,
  Lock,
  Sparkles,
  Camera,
  Upload,
  Trash2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { hashPassword } from '../lib/crypto'
import Avatar from '../components/Avatar'

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

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 2 MB.')
      e.target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Format file tidak didukung. Harap pilih gambar (JPG, PNG, atau WebP).')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const base64Data = reader.result
      await updateProfile({ avatar: base64Data })
      setSuccessMsg('Foto profil berhasil diunggah dan disimpan!')
      setTimeout(() => setSuccessMsg(''), 4000)
    }
    reader.onerror = () => {
      alert('Gagal membaca file foto.')
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = async () => {
    if (window.confirm('Hapus foto profil dan gunakan inisial nama?')) {
      await updateProfile({ avatar: null })
      setSuccessMsg('Foto profil dihapus. Profil kini menggunakan inisial nama.')
      setTimeout(() => setSuccessMsg(''), 4000)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Banner with Floating Ambient Orbs */}
      <div className="bg-gradient-to-r from-[#014181] via-[#002d5b] to-[#01356b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden animate-slide-up-fade">
        {/* Floating Ambient Glowing Orbs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#FF7401]/25 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
        <div className="absolute -bottom-10 left-1/4 w-52 h-52 bg-blue-400/20 rounded-full blur-2xl pointer-events-none animate-float-reverse"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Container with Upload Badge & Pulse Effect */}
          <div className="relative group">
            <Avatar
              src={user?.avatar}
              name={user?.nama || 'Staf BRI'}
              size="xl"
              className="ring-4 ring-white/30 group-hover:ring-[#FF7401]/60 group-hover:scale-105 transition-all duration-300 shadow-2xl"
            />
            {/* Quick Upload Button */}
            <label
              htmlFor="avatar-file-input"
              className="absolute -bottom-1 -right-1 p-2 rounded-2xl bg-[#FF7401] hover:bg-[#e06500] text-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ring-4 ring-[#014181] flex items-center justify-center"
              title="Upload / Ganti Foto Profil"
            >
              <Camera className="w-4 h-4" />
              <input
                id="avatar-file-input"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center sm:text-left min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF7401] text-[11px] font-bold tracking-wider uppercase mb-2 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>{user?.role || 'Staff'} • {user?.jabatan || 'Administrasi'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate">
              {user?.nama || 'Pengguna BRI'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
              Personal Number (PN): <strong className="text-white">{user?.pn || '-'}</strong> • Unit: BRI KCP Iskandar Palembang
            </p>

            {/* Photo Action Buttons */}
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <label
                htmlFor="avatar-file-input"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer transition hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{user?.avatar ? 'Ganti Foto' : 'Unggah Foto'}</span>
              </label>

              {user?.avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/35 text-red-200 hover:text-white text-xs font-semibold transition hover:scale-105 active:scale-95 border border-red-500/30 backdrop-blur-xs cursor-pointer"
                  title="Hapus foto profil dan gunakan inisial nama"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Gunakan Inisial</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forms: Edit Profile & Keamanan */}
      <div className="space-y-6">
        {/* Informasi Biodata Staf */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 animate-slide-up-fade stagger-1">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-[#014181]" />
            Informasi Biodata Staf
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Perbarui data kontak dan rincian jabatan Anda
          </p>

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-scale-in">
              <Check className="w-4 h-4 text-emerald-600" />
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
                className="px-5 py-2.5 rounded-xl bg-[#014181] hover:bg-[#002d5b] text-white font-bold text-xs shadow-md shadow-[#014181]/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Ganti Password */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 animate-slide-up-fade stagger-2">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#FF7401]" />
            Keamanan & Kata Sandi
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Ganti password akun login portal arsip Anda
          </p>

          {passwordMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-scale-in">
              <Check className="w-4 h-4 text-emerald-600" />
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
                className="px-4 py-2.5 rounded-xl bg-[#FF7401] hover:bg-[#e06500] text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
