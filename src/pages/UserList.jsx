import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserPlus,
  Search,
  Shield,
  ShieldAlert,
  Briefcase,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  X,
  Building2,
  Lock
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'

export default function UserList() {
  const { users, user: currentUser, isAdmin, addUser, deleteUser } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // Akses Guard: Jika bukan Admin, tampilkan peringatan pembatasan wewenang
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-[#FF7401]" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Akses Khusus Admin Kredit
        </h2>
        <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
          Akun Anda memiliki hak akses <strong>Role Staff</strong>. Halaman Manajemen Staf & Pengguna hanya dapat diakses oleh Administrator Kredit atau Supervisor BRI KCP Iskandar Palembang.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#014181] hover:bg-[#002d5b] text-white text-xs font-bold transition shadow-md shadow-[#014181]/20"
        >
          Kembali ke Dashboard
        </button>
      </div>
    )
  }

  const initialForm = {
    nama: '',
    pn: '',
    email: '',
    jabatan: 'Staff Administrasi Kredit',
    role: 'Staff',
    telepon: '',
    status: 'Aktif'
  }
  const [formData, setFormData] = useState(initialForm)

  const filteredUsers = users.filter(
    (u) =>
      u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.pn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAdmin) return
    if (!formData.nama.trim() || !formData.email.trim()) return

    addUser(formData)
    setIsAddModalOpen(false)
    setFormData(initialForm)
  }

  const handleDeleteConfirm = () => {
    if (!isAdmin) return
    if (userToDelete) {
      deleteUser(userToDelete.id)
      setUserToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Manajemen Staf & Pengguna
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#014181] font-bold text-xs">
              {users.length} Akun
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar staf, mantri, relationship manager, dan intern di BRI KCP Iskandar Palembang
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#014181] hover:bg-[#002d5b] text-white text-xs font-bold shadow-md shadow-[#014181]/20 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Staf Baru</span>
        </button>
      </div>

      {/* 4 Summary Stat Chips with Staggered Entrance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slide-up-fade stagger-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Akun</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#014181] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{users.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Pegawai terdaftar</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slide-up-fade stagger-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Administrator</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF7401] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {users.filter(u => u.role === 'Admin' || u.role === 'Supervisor').length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Akses wewenang penuh</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slide-up-fade stagger-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Mantri & Staff</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {users.filter(u => u.role !== 'Admin' && u.role !== 'Supervisor').length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Operasional kredit</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slide-up-fade stagger-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Status Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            {users.filter(u => (u.status || 'Aktif') === 'Aktif').length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">100% Siap melayani</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama staf, Personal Number (PN), atau jabatan..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
        {searchTerm && (
          <div className="mt-2 text-xs text-slate-500 pl-1">
            Menampilkan <strong>{filteredUsers.length}</strong> dari total {users.length} pengguna
          </div>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((item, idx) => {
          const isMe = item.id === currentUser?.id
          const staggerClass = `stagger-${(idx % 6) + 1}`
          return (
            <div
              key={item.id}
              className={`group bg-white rounded-3xl p-6 border transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 relative overflow-hidden animate-slide-up-fade ${staggerClass} ${
                isMe ? 'border-[#014181] ring-2 ring-[#014181]/20' : 'border-slate-200/80 hover:border-blue-200'
              }`}
            >
              {/* Animated bottom accent gradient bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#014181] via-[#0d5cb3] to-[#FF7401] transition-all duration-500 ease-out" />

              {isMe && (
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#014181] text-white text-[10px] font-bold shadow-xs">
                  Akun Anda
                </div>
              )}

              <div className="flex items-center gap-3.5">
                <Avatar
                  src={item.avatar}
                  name={item.nama}
                  size="lg"
                  className="w-14 h-14 rounded-2xl ring-2 ring-slate-100 group-hover:ring-[#014181]/30 group-hover:scale-105 transition-all duration-300 shadow-sm"
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#014181] transition-colors truncate">
                    {item.nama}
                  </h3>
                  <p className="text-xs text-[#014181] font-semibold truncate">
                    {item.jabatan}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    PN: {item.pn}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 group-hover:text-slate-800 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#014181] transition-colors shrink-0" />
                  <span className="truncate">{item.email}</span>
                </div>
                <div className="flex items-center gap-2 group-hover:text-slate-800 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#014181] transition-colors shrink-0" />
                  <span>{item.telepon || '-'}</span>
                </div>
                <div className="flex items-center gap-2 group-hover:text-slate-800 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF7401] transition-colors shrink-0" />
                  <span className="truncate">{item.unit || 'KCP Iskandar'}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {item.status || 'Aktif'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    item.role === 'Admin' || item.role === 'Supervisor'
                      ? 'bg-blue-100 text-[#014181]'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.role || 'Staff'}
                  </span>
                </div>

                {isAdmin && !isMe && (
                  <button
                    onClick={() => setUserToDelete(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all"
                    title="Hapus Pengguna"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Tambah Staf */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-slide-up-fade">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Akun Staf Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama Lengkap Staf"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Personal Number (PN BRI) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pn}
                  onChange={(e) => setFormData({ ...formData, pn: e.target.value })}
                  placeholder="00192837"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Kantor (@bri.co.id) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staf@bri.co.id"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jabatan / Posisi
                </label>
                <select
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                >
                  <option value="Staff Administrasi Kredit">Staff Administrasi Kredit</option>
                  <option value="Mantri Unit / AO">Mantri Unit / AO</option>
                  <option value="Relationship Manager (RM)">Relationship Manager (RM)</option>
                  <option value="Supervisor Bisnis & Kredit">Supervisor Bisnis & Kredit</option>
                  <option value="Intern Staff (Magang)">Intern Staff (Magang)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#014181] shrink-0" />
                <span>Password awal staf: <strong>123456</strong> (otomatis dienkripsi SHA-256 di Supabase)</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#014181] hover:bg-[#002d5b] rounded-xl shadow-md"
                >
                  Simpan Staf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-slide-up-fade">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Hapus Akun Pengguna?
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Apakah Anda yakin ingin menghapus akses untuk <strong>{userToDelete.nama}</strong> ({userToDelete.pn})?
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
