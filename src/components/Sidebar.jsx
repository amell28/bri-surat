import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCheck,
  LogOut,
  Building2,
  FileClock,
  ShieldAlert,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSurat } from '../context/SuratContext'

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth()
  const { stats } = useSurat()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/surat',
      label: 'Data Arsip Surat',
      icon: FileText,
      badge: stats.total
    },
    {
      to: '/users',
      label: 'Manajemen Staf',
      icon: Users,
      badge: null
    },
    {
      to: '/profile',
      label: 'Profil Pengguna',
      icon: UserCheck,
      badge: null
    }
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-gradient-to-b from-[#014181] via-[#01356b] to-[#00254c] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-md">
              <span className="text-xl font-black tracking-tighter text-[#014181]">
                BRI
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base tracking-wide uppercase text-white">
                  KCP Iskandar
                </h1>
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF7401] animate-pulse"></span>
              </div>
              <p className="text-xs text-blue-200/90 font-medium">
                Palembang • Arsip Surat
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-blue-300/80">
            Menu Utama
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FF7401] text-white shadow-lg shadow-[#FF7401]/30 font-semibold translate-x-1'
                      : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}

          <div className="pt-6 px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-blue-300/80">
            Status Monitoring
          </div>

          <div className="p-3.5 mx-1 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between text-blue-200">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#FF7401]" />
                SP Default
              </span>
              <span className="font-bold text-white px-2 py-0.5 rounded bg-red-500/30 text-red-200">
                {stats.spDefaultCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-blue-200">
              <span className="flex items-center gap-1.5">
                <FileClock className="w-4 h-4 text-amber-300" />
                Perlu Cek Berkas
              </span>
              <span className="font-bold text-white px-2 py-0.5 rounded bg-amber-500/30 text-amber-200">
                {stats.urgentCount}
              </span>
            </div>
          </div>
        </div>

        {/* Project Intern Info Card */}
        <div className="px-4 py-3 mx-4 mb-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/10 text-xs">
          <div className="flex items-center gap-2 mb-1 text-[#FF7401] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tugas Akhir Magang</span>
          </div>
          <p className="text-blue-100 text-[11px] leading-relaxed">
            Sistem Pencarian & Administrasi Surat Penagihan (SP 1, SP 2, SP 3, Default, LPJ, PK)
          </p>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/15">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={user?.nama}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF7401]/60 shrink-0"
              />
              <div className="min-w-0 truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.nama || 'Staf BRI'}
                </p>
                <p className="text-[10px] text-blue-200/80 truncate">
                  PN: {user?.pn || '-'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
