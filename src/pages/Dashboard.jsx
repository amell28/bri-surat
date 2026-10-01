import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileText,
  AlertTriangle,
  ShieldAlert,
  Search,
  PlusCircle,
  Download,
  Calendar,
  ChevronRight,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Database
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSurat } from '../context/SuratContext'
import StatCard from '../components/StatCard'
import SupabaseSyncModal from '../components/SupabaseSyncModal'

export default function Dashboard() {
  const { user } = useAuth()
  const { suratList, stats, exportToCsv, isConfigured, syncStatus } = useSurat()
  const navigate = useNavigate()

  const [quickQuery, setQuickQuery] = useState('')
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false)

  // Quick search results on dashboard
  const quickResults = quickQuery.trim()
    ? suratList.filter(
        (s) =>
          s.nama.toLowerCase().includes(quickQuery.toLowerCase()) ||
          s.tahun.includes(quickQuery) ||
          (s.lpj && s.lpj.toLowerCase().includes(quickQuery.toLowerCase())) ||
          (s.pk && s.pk.toLowerCase().includes(quickQuery.toLowerCase()))
      ).slice(0, 6)
    : []

  // Urgent and default items
  const priorityList = suratList
    .filter((s) => s.spDefault !== '-' || s.sp1Urgent || s.sp3Urgent || s.lpjUrgent || s.pkUrgent)
    .slice(0, 6)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#014181] via-[#0256ab] to-[#01356b] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-3 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#FF7401]"></span>
              <span>BRI Kantor Cabang Pembantu (KCP) Iskandar Palembang</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Bertugas, {user?.nama || 'Staf BRI'}! 👋
            </h1>
            <p className="mt-2 text-sm text-blue-100/90 leading-relaxed">
              Portal penelusuran cepat berkas SP 1, SP 2, SP 3, SP Default, LPJ, dan Perjanjian Kredit (PK). Membantu staf menemukan arsip debitur dalam hitungan detik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/surat"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF7401] hover:bg-[#e06500] text-white text-xs font-bold shadow-lg shadow-[#FF7401]/30 hover:scale-102 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Kelola & Input Surat</span>
            </Link>
            <button
              onClick={() => exportToCsv()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold hover:scale-102 transition"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Rekap CSV</span>
            </button>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs font-bold hover:scale-102 transition"
            >
              <Database className="w-4 h-4 text-emerald-300" />
              <span>{isConfigured ? 'Supabase Terhubung' : 'Upload ke Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#FF7401]/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* Quick Search Widget */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#014181]" />
              Penelusuran Cepat Berkas Debitur (Fast Search)
            </h2>
            <p className="text-xs text-slate-500">
              Ketik nama debitur atau badan usaha (misal: "Budi Santoso", "Sriwijaya", "Ahmad Fauzi", "Ampera")
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#014181] border border-blue-200/60 self-start sm:self-auto">
            ⚡ Instant Response
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Ketik nama nasabah, tahun kredit, atau nomor dokumen di sini..."
            className="w-full pl-11 pr-24 py-3.5 text-sm rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-[#014181] focus:ring-4 focus:ring-[#014181]/10 text-slate-900 placeholder-slate-400 transition"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
          {quickQuery && (
            <button
              onClick={() => setQuickQuery('')}
              className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200/70 hover:bg-slate-200 px-2 py-1 rounded-lg"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Quick Results Box */}
        {quickQuery && (
          <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50">
            {quickResults.length > 0 ? (
              quickResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/surat?q=${encodeURIComponent(item.nama)}`)}
                  className="p-3.5 sm:p-4 hover:bg-blue-50/60 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#014181]">
                        {item.nama}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                        Tahun {item.tahun}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'SP DEFAULT'
                            ? 'bg-rose-100 text-rose-700'
                            : item.status.includes('SP 3')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>SP 1: <strong className={item.sp1Urgent ? 'text-rose-600 font-bold' : ''}>{item.sp1}</strong></span>
                      <span>SP 2: <strong>{item.sp2}</strong></span>
                      <span>SP 3: <strong className={item.sp3Urgent ? 'text-rose-600 font-bold' : ''}>{item.sp3}</strong></span>
                      <span>SP Default: <strong className="text-rose-600 font-bold">{item.spDefault}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium truncate max-w-xs">
                      {item.lpj} • {item.pk}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-[#014181]">
                      Buka <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                Tidak ditemukan debitur dengan kata kunci "<strong>{quickQuery}</strong>". Silakan periksa ejaan atau buka halaman <Link to="/surat" className="text-[#014181] font-bold underline">Data Arsip Surat</Link>.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Debitur Terarsip"
          value={stats.total}
          subtext="Data surat terdata di KCP Iskandar"
          icon={FileText}
          colorScheme="blue"
          onClick={() => navigate('/surat')}
        />
        <StatCard
          title="Surat Peringatan 1, 2, 3"
          value={stats.sp1Count + stats.sp2Count + stats.sp3Count}
          subtext={`${stats.sp1Count} SP1 • ${stats.sp2Count} SP2 • ${stats.sp3Count} SP3`}
          icon={TrendingUp}
          colorScheme="orange"
          onClick={() => navigate('/surat?filter=sp')}
        />
        <StatCard
          title="SP Default (Macet / Lelang)"
          value={stats.spDefaultCount}
          subtext="Nasabah tahap penanganan khusus"
          icon={ShieldAlert}
          colorScheme="red"
          onClick={() => navigate('/surat?filter=sp_default')}
        />
        <StatCard
          title="Perlu Verifikasi Berkas"
          value={stats.urgentCount}
          subtext="Tanda merah di Excel (LPJ / PK)"
          icon={AlertTriangle}
          colorScheme="amber"
          onClick={() => navigate('/surat?filter=urgent')}
        />
      </div>

      {/* Grid: Visual Charts & Priority Debtor Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Tahun & Status Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Year breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Distribusi Arsip Surat per Tahun Kredit
                </h3>
                <p className="text-xs text-slate-500">
                  Data debitur dari tahun 2020 hingga proyeksi 2026
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {stats.tahunList.length} Periode Tahun
              </span>
            </div>

            <div className="space-y-3.5">
              {stats.tahunList.map((th) => {
                const count = stats.yearDistribution[th] || 0
                const percent = Math.round((count / stats.total) * 100)
                return (
                  <div key={th} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#014181]" />
                        Tahun {th}
                      </span>
                      <span className="text-slate-500">
                        {count} Berkas ({percent}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#014181] to-[#FF7401] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dokumen LPJ & PK info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Kelengkapan Dokumen LPJ & Perjanjian Kredit (PK)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Laporan Pertanggungjawaban (LPJ) & Perjanjian Kredit (PK) tersimpan rapi dengan tautan nama debitur
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#014181] mb-1">
                  <FileCheck className="w-4 h-4" />
                  <span>Dokumen LPJ Tersedia</span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {suratList.filter(s => s.lpj && s.lpj !== '-').length} Dokumen
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Format: LPJ - [NAMA NASABAH]
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF7401] mb-1">
                  <FileText className="w-4 h-4" />
                  <span>Perjanjian Kredit (PK)</span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {suratList.filter(s => s.pk && s.pk !== '-').length} Dokumen
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Format: PK - [NAMA NASABAH]
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right (1 col): Urgent Follow-Up Debitur */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FF7401]" />
                  Tindak Lanjut Prioritas
                </h3>
                <p className="text-xs text-slate-500">
                  Surat Default & Berkas Butuh Verifikasi
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                {priorityList.length} Kasus
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {priorityList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/surat?q=${encodeURIComponent(item.nama)}`)}
                  className="py-3 group cursor-pointer hover:bg-slate-50 transition -mx-2 px-2 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#014181] transition truncate">
                        {item.nama}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Tahun: {item.tahun} • Status: <span className="font-semibold text-rose-600">{item.status}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {item.catatan}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/surat?filter=urgent"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-50 text-center font-bold text-xs text-[#014181] transition block"
            >
              Lihat Seluruh Daftar Prioritas ({stats.urgentCount}) →
            </Link>
          </div>
        </div>
      </div>

      {/* Supabase Sync Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  )
}
