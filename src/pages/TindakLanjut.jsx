import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Bell,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  ClipboardList,
  FileText,
  Filter,
  Check,
  X,
  Info
} from 'lucide-react'
import { useSurat } from '../context/SuratContext'
import { useAuth } from '../context/AuthContext'

export default function TindakLanjut() {
  const { stats, updateSurat } = useSurat()
  const { canEdit } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const tabFromUrl = searchParams.get('tab')
  const activeTab = ['sp2', 'sp3', 'default'].includes(tabFromUrl) ? tabFromUrl : 'sp2'
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(10) // 10 per lembar
  const [currentPage, setCurrentPage] = useState(1)
  const [lunasDebitur, setLunasDebitur] = useState(null) // Debitur yang akan ditandai lunas/gugur
  const [isSubmittingLunas, setIsSubmittingLunas] = useState(false)
  const [nowTimestamp] = useState(() => Date.now())

  const handleTabChange = (key) => {
    setSearchQuery('')
    setCurrentPage(1)
    setSearchParams({ tab: key })
  }

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (val) => {
    setPageSize(Number(val))
    setCurrentPage(1)
  }

  const sp1NeedsSP2 = stats.sp1NeedsSP2 || []
  const sp2NeedsSP3 = stats.sp2NeedsSP3 || []
  const sp3NeedsDefault = stats.sp3NeedsDefault || []
  const totalEskalasi = sp1NeedsSP2.length + sp2NeedsSP3.length + sp3NeedsDefault.length

  const tabs = [
    {
      key: 'sp2',
      label: 'Perlu SP 2',
      sublabel: 'SP 1 → SP 2',
      count: sp1NeedsSP2.length,
      items: sp1NeedsSP2,
      spKey: 'sp1',
      spLabel: 'SP 1 Dikirim',
      nextSP: 'SP 2',
      desc: 'Debitur berikut telah menerima SP 1 lebih dari 14 hari lalu dan belum membayar. Segera terbitkan SP 2. (Jika debitur sudah membayar, tandai "Gugur / Lunas" agar siklus SP di-reset kembali ke awal).',
      colorAccent: 'bg-amber-500',
      colorBg: 'bg-amber-50',
      colorBorder: 'border-amber-300',
      colorText: 'text-amber-900',
      colorSubtext: 'text-amber-700',
      colorBadge: 'bg-amber-100 text-amber-800',
      colorBadgeActive: 'bg-amber-500 text-white',
      colorRow: 'hover:bg-amber-50/60',
      colorTag: 'bg-amber-100 text-amber-800 border-amber-200',
      colorNext: 'bg-amber-500/10 text-amber-700 border-amber-300',
      colorBtn: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    {
      key: 'sp3',
      label: 'Perlu SP 3',
      sublabel: 'SP 2 → SP 3',
      count: sp2NeedsSP3.length,
      items: sp2NeedsSP3,
      spKey: 'sp2',
      spLabel: 'SP 2 Dikirim',
      nextSP: 'SP 3',
      desc: 'Debitur berikut telah menerima SP 2 lebih dari 14 hari lalu dan belum ada pembayaran. Segera terbitkan SP 3 sebagai peringatan terakhir sebelum tahap lelang.',
      colorAccent: 'bg-orange-500',
      colorBg: 'bg-orange-50',
      colorBorder: 'border-orange-300',
      colorText: 'text-orange-900',
      colorSubtext: 'text-orange-700',
      colorBadge: 'bg-orange-100 text-orange-800',
      colorBadgeActive: 'bg-orange-500 text-white',
      colorRow: 'hover:bg-orange-50/60',
      colorTag: 'bg-orange-100 text-orange-800 border-orange-200',
      colorNext: 'bg-orange-500/10 text-orange-700 border-orange-300',
      colorBtn: 'bg-orange-500 hover:bg-orange-600 text-white',
    },
    {
      key: 'default',
      label: 'Perlu SP Default (Siap Lelang)',
      sublabel: 'SP > 3 → Siap Lelang Agunan',
      count: sp3NeedsDefault.length,
      items: sp3NeedsDefault,
      spKey: 'sp3',
      spLabel: 'SP 3 Dikirim',
      nextSP: 'SP Default / Lelang',
      desc: 'Debitur berikut telah melewati SP 3 lebih dari 14 hari lalu tanpa penyelesaian. Sesuai ketentuan, surat SP yang sudah lebih dari 3 masuk tahap SP Default dan agunan/jaminan kredit debitur SUDAH BISA DIAJUKAN LELANG.',
      colorAccent: 'bg-rose-600',
      colorBg: 'bg-rose-50',
      colorBorder: 'border-rose-300',
      colorText: 'text-rose-900',
      colorSubtext: 'text-rose-700',
      colorBadge: 'bg-rose-100 text-rose-800',
      colorBadgeActive: 'bg-rose-600 text-white',
      colorRow: 'hover:bg-rose-50/60',
      colorTag: 'bg-rose-100 text-rose-800 border-rose-200',
      colorNext: 'bg-rose-500/10 text-rose-700 border-rose-300',
      colorBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
  ]

  const currentTab = tabs.find(t => t.key === activeTab) || tabs[0]

  // Filter berdasarkan search
  const filteredItems = currentTab.items.filter(s =>
    !searchQuery.trim() ||
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s[currentTab.spKey] && s[currentTab.spKey].toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Pagination logic (Default 10 per lembar)
  const totalItems = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxButtons = 5
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, start + maxButtons - 1)
      if (end - start + 1 < maxButtons) {
        start = Math.max(1, end - maxButtons + 1)
      }
      for (let i = start; i <= end; i++) pages.push(i)
    }
    return pages
  }

  // Hitung hari sejak tanggal SP
  function hariSejak(raw) {
    if (!raw || raw === '-') return null
    let d = new Date(raw)
    if (isNaN(d.getTime())) {
      const match = raw.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/)
      if (match) {
        const months = { jan:0,feb:1,mar:2,apr:3,mei:4,may:4,jun:5,jul:6,agu:7,aug:7,sep:8,okt:9,oct:9,nov:10,des:11,dec:11 }
        const mo = months[match[2].toLowerCase()]
        const yr = match[3].length === 2 ? (parseInt(match[3]) + 2000) : parseInt(match[3])
        if (mo !== undefined) d = new Date(yr, mo, parseInt(match[1]))
      }
    }
    if (isNaN(d.getTime())) return null
    return Math.floor((nowTimestamp - d.getTime()) / (1000 * 60 * 60 * 24))
  }

  function urgencyLabel(days) {
    if (days === null) return null
    if (days >= 60) return { label: `${days} hari`, cls: 'bg-rose-100 text-rose-800 border-rose-200' }
    if (days >= 30) return { label: `${days} hari`, cls: 'bg-orange-100 text-orange-800 border-orange-200' }
    return { label: `${days} hari`, cls: 'bg-amber-100 text-amber-800 border-amber-200' }
  }

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#014181] via-[#0256ab] to-[#01356b] p-6 sm:p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
                  <Bell className="w-3.5 h-3.5 text-[#FF7401]" />
                  <span>Tindak Lanjut Pengiriman Surat</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Eskalasi Surat Peringatan
              </h1>
              <p className="mt-2 text-sm text-blue-100/90 max-w-xl leading-relaxed">
                Daftar debitur yang memerlukan tindak lanjut pengiriman surat peringatan berikutnya berdasarkan batas waktu 14 hari sejak surat terakhir.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-4xl font-black">{totalEskalasi}</div>
              <div className="text-sm text-blue-200 font-semibold">Total debitur perlu ditindaklanjuti</div>
            </div>
          </div>

          {/* Summary row */}
          <div className="mt-5 flex flex-wrap gap-3">
            {tabs.map(t => (
              <div key={t.key} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold">
                <span className={`w-2 h-2 rounded-full ${t.colorAccent}`} />
                <span className="text-blue-100">{t.sublabel}:</span>
                <span className="font-black text-white">{t.count} debitur</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#FF7401]/20 blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
      </div>

      {/* Edukatif & Penjelasan Konsep SOP BRI */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/80 text-xs text-slate-700 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-[#014181] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#014181]">
            Ketentuan & Siklus Surat Peringatan (SOP Kredit BRI):
          </p>
          <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 leading-relaxed">
            <li><strong>Gugur = Lunas:</strong> Jika debitur membayar tunggakan setelah menerima SP, status SP dinyatakan <strong>Gugur / Lunas</strong> dan siklus penagihan di-reset. Jika menunggak lagi di kemudian hari, surat berikutnya dimulai kembali dari <strong>SP 1 lagi</strong>.</li>
            <li><strong>Eskalasi Penagihan:</strong> Jika debitur <strong>tidak membayar</strong> dalam 14 hari, penagihan berlanjut: <strong>SP 1 → SP 2 → SP 3</strong>.</li>
            <li><strong>SP &gt; 3 (Siap Lelang):</strong> Debitur yang telah melewati SP 3 dan tetap tidak membayar masuk status <strong>SP Default</strong> dan agunan/jaminan <strong>sudah bisa diajukan untuk proses Lelang</strong>.</li>
          </ul>
        </div>
      </div>

      {/* Jika tidak ada satupun yang perlu tindak lanjut */}
      {totalEskalasi === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-12 text-center">
          <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-400 mb-4" />
          <h3 className="text-lg font-black text-slate-800 mb-1">Semua Debitur Sudah Up-to-Date!</h3>
          <p className="text-sm text-slate-500">Tidak ada debitur yang memerlukan eskalasi surat peringatan saat ini.</p>
        </div>
      )}

      {totalEskalasi > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                className={`flex-1 min-w-[140px] flex flex-col items-center gap-0.5 px-4 py-4 text-xs font-bold transition-all border-b-2 ${
                  activeTab === t.key
                    ? `border-current ${t.colorText} ${t.colorBg}`
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full ${t.colorAccent} text-white text-[10px] font-black flex items-center justify-center shrink-0`}>
                    {t.count}
                  </span>
                  <span>{t.label}</span>
                </div>
                <span className={`text-[10px] font-normal ${activeTab === t.key ? t.colorSubtext : 'text-slate-400'}`}>
                  {t.sublabel} · maks. 14 hari
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Info banner tab aktif */}
            <div className={`flex items-start gap-3 p-3.5 rounded-2xl border ${currentTab.colorBg} ${currentTab.colorBorder}`}>
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${currentTab.colorText}`} />
              <p className={`text-xs leading-relaxed ${currentTab.colorText}`}>
                {currentTab.desc}
              </p>
            </div>

            {/* Search + Filter Items Per Lembar + Counter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Cari nama debitur..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181]/30 transition"
                />
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-slate-500 font-medium">Tampilkan:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#014181]/20 cursor-pointer"
                  >
                    <option value={10}>10 per lembar</option>
                    <option value={20}>20 per lembar</option>
                    <option value={50}>50 per lembar</option>
                    <option value={100}>Semua / 100</option>
                  </select>
                </div>

                <span className="text-xs text-slate-500 shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                  Menampilkan <strong className="text-slate-900 font-bold">{totalItems > 0 ? startIndex + 1 : 0} - {endIndex}</strong> dari <strong className="text-slate-900 font-bold">{totalItems}</strong> debitur
                </span>
              </div>
            </div>

            {/* Daftar debitur */}
            {paginatedItems.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">Tidak ditemukan</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-4">Nama Debitur</div>
                  <div className="col-span-1 text-center">Tahun</div>
                  <div className="col-span-2 text-center">{currentTab.spLabel}</div>
                  <div className="col-span-2 text-center">Sudah Berlalu</div>
                  <div className="col-span-2 text-center">Aksi / Tindakan</div>
                </div>

                {paginatedItems.map((s, idx) => {
                  const days = hariSejak(s[currentTab.spKey])
                  const urgency = urgencyLabel(days)
                  return (
                    <div
                      key={s.id}
                      className={`grid grid-cols-12 gap-2 px-4 py-3 items-center transition-colors ${currentTab.colorRow} ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                    >
                      {/* No */}
                      <div className="col-span-1 text-center text-xs text-slate-400 font-semibold">{startIndex + idx + 1}</div>

                      {/* Nama */}
                      <div className="col-span-4 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{s.nama}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${currentTab.colorTag}`}>
                            {currentTab.nextSP} diperlukan
                          </span>
                        </div>
                      </div>

                      {/* Tahun */}
                      <div className="col-span-1 text-center">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {s.tahun}
                        </span>
                      </div>

                      {/* Tanggal SP sebelumnya */}
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-slate-700 font-semibold">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{s[currentTab.spKey] || '-'}</span>
                        </div>
                      </div>

                      {/* Hari berlalu */}
                      <div className="col-span-2 text-center">
                        {urgency ? (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${urgency.cls}`}>
                            {urgency.label}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>

                      {/* Aksi */}
                      <div className="col-span-2 flex items-center justify-center gap-1.5">
                        {canEdit && (
                          <button
                            onClick={() => setLunasDebitur(s)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                            title="Tandai Debitur Sudah Membayar (Gugur / Lunas)"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Lunas/Gugur</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/surat?q=${encodeURIComponent(s.nama)}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#014181] hover:bg-blue-50 transition cursor-pointer"
                          title="Buka & Input Surat di Data Arsip"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <span className="text-slate-500">
                  Halaman <strong className="text-slate-800">{currentPage}</strong> dari{' '}
                  <strong className="text-slate-800">{totalPages}</strong> (Total {totalItems} debitur)
                </span>

                <div className="flex items-center gap-1">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
                    title="Halaman Pertama"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Prev Page */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition font-semibold text-xs"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-1">
                    {getPageNumbers().map((num) => (
                      <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          currentPage === num
                            ? 'bg-[#014181] text-white shadow-xs'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition font-semibold text-xs"
                    title="Halaman Selanjutnya"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
                    title="Halaman Terakhir"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Klik tombol <strong>Lunas/Gugur</strong> jika debitur sudah membayar tunggakan, atau panah untuk input surat eskalasi.
              </p>
              <button
                onClick={() => navigate('/surat')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#014181] hover:bg-[#002d5b] text-white text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                Buka Data Arsip
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Pelunasan / Gugur SP */}
      {lunasDebitur && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <button
                onClick={() => setLunasDebitur(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Konfirmasi Debitur Membayar (SP Gugur / Lunas)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Debitur: <strong className="text-slate-800">{lunasDebitur.nama}</strong> ({lunasDebitur.tahun})
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                Konsep Gugur = Lunas:
              </p>
              <p className="text-[11px] text-emerald-800">
                Karena debitur telah membayar tunggakan, status SP yang berjalan ini dinyatakan <strong>GUGUR / LUNAS</strong> dan siklus peringatan di-reset.
              </p>
              <p className="text-[11px] text-emerald-800">
                Jika di masa mendatang debitur menunggak lagi, surat baru akan dimulai kembali dari <strong>SP 1 lagi</strong> (bukan eskalasi).
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setLunasDebitur(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmittingLunas}
                onClick={async () => {
                  setIsSubmittingLunas(true)
                  try {
                    await updateSurat(lunasDebitur.id, {
                      statusAkhir: 'Lunas',
                      tanggalStatusAkhir: new Date().toISOString().slice(0, 10),
                      catatan: `${lunasDebitur.catatan ? lunasDebitur.catatan + ' | ' : ''}Debitur telah membayar tunggakan. Status SP gugur/lunas (siklus SP di-reset).`
                    })
                    setLunasDebitur(null)
                  } finally {
                    setIsSubmittingLunas(false)
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmittingLunas ? 'Menyimpan...' : 'Ya, Tandai Lunas / Gugur'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

