import { useState } from 'react'
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Briefcase,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  X,
  Building2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function UserList() {
  const { users, user: currentUser, addUser, deleteUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

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
    if (!formData.nama.trim() || !formData.email.trim()) return

    addUser(formData)
    setIsAddModalOpen(false)
    setFormData(initialForm)
  }

  const handleDeleteConfirm = () => {
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#014181] hover:bg-[#002d5b] text-white text-xs font-bold shadow-md shadow-[#014181]/20 hover:scale-102 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Staf Baru</span>
        </button>
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
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((item) => {
          const isMe = item.id === currentUser?.id
          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-200 shadow-xs hover:shadow-md relative overflow-hidden ${
                isMe ? 'border-[#014181] ring-2 ring-[#014181]/20' : 'border-slate-200/80'
              }`}
            >
              {isMe && (
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#014181] text-white text-[10px] font-bold">
                  Akun Anda
                </div>
              )}

              <div className="flex items-center gap-3.5">
                <img
                  src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={item.nama}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-900 truncate">
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
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.telepon || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.unit}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {item.status || 'Aktif'}
                </span>

                {!isMe && (
                  <button
                    onClick={() => setUserToDelete(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
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
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
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
