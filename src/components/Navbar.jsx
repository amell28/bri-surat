import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  LogOut,
  X,
  Database
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSurat } from '../context/SuratContext'
import SupabaseSyncModal from './SupabaseSyncModal'
import Avatar from './Avatar'

export default function Navbar({ onMenuToggle }) {
  const { user, isAdmin, logout } = useAuth()
  const { stats, suratList, isConfigured } = useSurat()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSupabaseModal, setShowSupabaseModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  // Debitor with urgent flags or SP Default
  const urgentItems = suratList.filter(
    (s) => s.spDefault !== '-' || s.sp1Urgent || s.sp3Urgent || s.lpjUrgent || s.pkUrgent
  ).slice(0, 5)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/surat?q=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Toggle button on mobile */}
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 transition"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#014181] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 hidden sm:inline-block">
              Unit Kerja
            </span>
            <h2 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
              BRI KCP Iskandar Palembang
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 hidden md:block">
            Portal Administrasi Surat Peringatan (SP) & Perjanjian Kredit
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64 lg:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama debitur atau berkas..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-slate-100/90 text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#014181] focus:bg-white transition"
          />
          <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
        </form>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 rounded-full hover:bg-slate-100 transition"
            title="Pemberitahuan Surat"
          >
            <Bell className="w-5 h-5" />
            {urgentItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7401] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF7401]"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#FF7401]" />
                  <span className="text-xs font-bold text-slate-800">
                    Perlu Tindak Lanjut ({stats.urgentCount})
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {urgentItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowNotifications(false)
                      navigate(`/surat?q=${encodeURIComponent(item.nama)}`)
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-[#FF7401] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.nama} ({item.tahun})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Status: <span className="font-medium text-[#014181]">{item.status}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {item.catatan}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false)
                    navigate('/surat?filter=urgent')
                  }}
                  className="text-xs font-semibold text-[#014181] hover:underline"
                >
                  Lihat Semua Surat Bermasalah →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Supabase Status Chip / Trigger (Khusus Admin) */}
        {isAdmin && (
          <button
            onClick={() => setShowSupabaseModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-2xs ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-blue-50 text-[#014181] border border-blue-200 hover:bg-blue-100'
            }`}
            title="Sinkronisasi Database Supabase (Khusus Admin)"
          >
            <Database className="w-3.5 h-3.5 text-[#014181]" />
            <span className="hidden sm:inline">
              {isConfigured ? 'Supabase Sync' : 'Konek Supabase'}
            </span>
          </button>
        )}

        {/* User Chip */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-2 cursor-pointer hover:opacity-85 transition"
        >
          <Avatar
            src={user?.avatar}
            name={user?.nama || 'Staf BRI'}
            size="sm"
            className="border border-[#014181]/20 shadow-xs"
          />
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-slate-800 leading-tight">
              {user?.nama?.split(' ')[0] || 'Staf'}
            </span>
            <span className="block text-[10px] text-[#014181] font-medium leading-none">
              {user?.role || 'Staff'}
            </span>
          </div>
        </div>
      </div>

      {/* Supabase Modal */}
      <SupabaseSyncModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </header>
  )
}

