import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCheck,
  LogOut,
  FileClock,
  ShieldAlert,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSurat } from '../context/SuratContext'

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, isAdmin, logout } = useAuth()
  const { stats } = useSurat()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showLogoutConfirm) {
        setShowLogoutConfirm(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLogoutConfirm])

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    if (setIsOpen) setIsOpen(false)
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
    ...(isAdmin
      ? [
          {
            to: '/users',
            label: 'Manajemen Staf',
            icon: Users,
            badge: null
          }
        ]
      : []),
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

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-white/10 bg-black/15">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-600/90 text-blue-100 hover:text-white font-semibold text-xs tracking-wide transition-all duration-200 border border-white/10 shadow-xs group"
          >
            <LogOut className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Modal Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 relative overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-[#FF7401] to-[#014181]" />

            {/* Close button */}
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Warning / Logout Icon */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50/60 shadow-inner">
              <LogOut className="w-7 h-7" />
            </div>

            {/* Title & Desc */}
            <h3 className="text-lg font-black text-slate-900 mb-1.5">
              Konfirmasi Logout
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Apakah Anda yakin ingin keluar dari sistem Administrasi Surat <strong className="text-slate-700">BRI KCP Iskandar Palembang</strong>?
            </p>

            {/* Info Akun yang Sedang Aktif */}
            {user && (
              <div className="mb-5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left flex items-center gap-2.5">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={user.nama}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {user.nama}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate flex items-center gap-1.5">
                    <span>PN: {user.pn || '-'}</span>
                    <span>•</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                      user.role === 'Admin' ? 'bg-[#FF7401]/15 text-[#FF7401]' : 'bg-[#014181]/15 text-[#014181]'
                    }`}>
                      {user.role || 'Staff'}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
