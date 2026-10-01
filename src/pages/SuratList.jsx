import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  RotateCcw,
  Edit,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  AlertTriangle,
  Calendar,
  FileText,
  FileCheck,
  Building,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { useSurat } from '../context/SuratContext'
import { useAuth } from '../context/AuthContext'

export default function SuratList() {
  const { user, isAdmin, isStaff } = useAuth()
  const { suratList, addSurat, updateSurat, deleteSurat, resetToExcelInitial, exportToCsv, stats } = useSurat()
  const [searchParams, setSearchParams] = useSearchParams()

  // State Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'ALL')
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get('filter') === 'sp_default'
      ? 'SP DEFAULT'
      : searchParams.get('filter') === 'urgent'
      ? 'URGENT'
      : searchParams.get('filter') === 'sp'
      ? 'SP'
      : 'ALL'
  )

  // Keep query params synced if URL changes
  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) setSearchTerm(q)

    const f = searchParams.get('filter')
    if (f === 'urgent') setSelectedStatus('URGENT')
    else if (f === 'sp_default') setSelectedStatus('SP DEFAULT')
    else if (f === 'sp') setSelectedStatus('SP')
  }, [searchParams])

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)

  // Form State
  const initialForm = {
    nama: '',
    tahun: new Date().getFullYear().toString(),
    sp1: '-',
    sp1Urgent: false,
    sp2: '-',
    sp2Urgent: false,
    sp3: '-',
    sp3Urgent: false,
    spDefault: '-',
    spDefaultUrgent: false,
    lpj: '',
    lpjUrgent: false,
    pk: '',
    pkUrgent: false,
    catatan: ''
  }
  const [formData, setFormData] = useState(initialForm)

  // Filtering Logic
  const filteredSurat = useMemo(() => {
    return suratList.filter((item) => {
      // Search term
      const matchesSearch =
        !searchTerm.trim() ||
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tahun.includes(searchTerm) ||
        (item.lpj && item.lpj.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.pk && item.pk.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.catatan && item.catatan.toLowerCase().includes(searchTerm.toLowerCase()))

      // Year filter
      const matchesYear = selectedYear === 'ALL' || item.tahun === selectedYear

      // Status filter
      let matchesStatus = true
      if (selectedStatus === 'URGENT') {
        matchesStatus =
          item.sp1Urgent ||
          item.sp3Urgent ||
          item.lpjUrgent ||
          item.pkUrgent ||
          item.spDefaultUrgent ||
          item.spDefault !== '-'
      } else if (selectedStatus === 'SP DEFAULT') {
        matchesStatus = item.spDefault !== '-'
      } else if (selectedStatus === 'SP') {
        matchesStatus = (item.sp1 && item.sp1 !== '-') || (item.sp2 && item.sp2 !== '-') || (item.sp3 && item.sp3 !== '-')
      } else if (selectedStatus === 'SP 1') {
        matchesStatus = item.sp1 && item.sp1 !== '-'
      } else if (selectedStatus === 'SP 2') {
        matchesStatus = item.sp2 && item.sp2 !== '-'
      } else if (selectedStatus === 'SP 3') {
        matchesStatus = item.sp3 && item.sp3 !== '-'
      }

      return matchesSearch && matchesYear && matchesStatus
    })
  }, [suratList, searchTerm, selectedYear, selectedStatus])

  // Pagination State (Default 10 surat per lembar pertama)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset ke lembar pertama jika filter, pencarian, atau batas tampilan berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedYear, selectedStatus, pageSize])

  const totalItems = filteredSurat.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const paginatedSurat = useMemo(() => {
    return filteredSurat.slice(startIndex, endIndex)
  }, [filteredSurat, startIndex, endIndex])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 320, behavior: 'smooth' })
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, start + maxVisible - 1)
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }
      for (let i = start; i <= end; i++) pages.push(i)
    }
    return pages
  }

  // Handle Add Form
  const handleOpenAdd = () => {
    setFormData(initialForm)
    setIsAddModalOpen(true)
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!formData.nama.trim()) return

    const payload = {
      ...formData,
      lpj: formData.lpj.trim() || `LPJ - ${formData.nama.toUpperCase().trim()}`,
      pk: formData.pk.trim() || `PK - ${formData.nama.toUpperCase().trim()}`
    }

    addSurat(payload)
    setIsAddModalOpen(false)
    setFormData(initialForm)
  }

  // Handle Edit Form
  const handleOpenEdit = (item) => {
    setSelectedItem(item)
    setFormData({ ...item })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!selectedItem) return

    // Jika Role Staff, pertahankan nama dan tahun asli agar tidak terubah
    const finalData = isAdmin
      ? formData
      : {
          ...formData,
          nama: selectedItem.nama,
          tahun: selectedItem.tahun
        }

    updateSurat(selectedItem.id, finalData)
    setIsEditModalOpen(false)
    setSelectedItem(null)
  }

  // Handle Detail
  const handleOpenDetail = (item) => {
    setSelectedItem(item)
    setIsDetailModalOpen(true)
  }

  // Handle Delete Confirmation (Hanya Admin yang berwenang)
  const handleDeleteConfirm = () => {
    if (!isAdmin) {
      alert('Akses Ditolak: Anda berstatus Role Staff. Penghapusan arsip surat hanya dapat dilakukan oleh Admin Kredit.')
      setItemToDelete(null)
      return
    }

    if (itemToDelete) {
      deleteSurat(itemToDelete.id)
      setItemToDelete(null)
    }
  }

  // Print function
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Data Arsip Surat Debitur
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#014181] font-bold text-xs">
              {filteredSurat.length} Berkas
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#014181] hover:bg-[#002d5b] text-white text-xs font-bold shadow-md shadow-[#014181]/20 hover:scale-102 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Debitur / Surat</span>
          </button>

          <button
            onClick={() => exportToCsv(filteredSurat)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs hover:scale-102 transition"
            title="Download file CSV / Excel"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs hover:scale-102 transition"
            title="Cetak Laporan Surat"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Filter & Live Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama debitur, berkas LPJ, atau PK..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Year */}
          <div className="md:col-span-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] transition font-medium"
            >
              <option value="ALL">Semua Tahun (2020 - 2026)</option>
              {stats.tahunList.map((th) => (
                <option key={th} value={th}>
                  Tahun {th}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#014181] transition font-medium"
            >
              <option value="ALL"> Semua Status Berkas</option>
              <option value="URGENT"> Perlu Tindak Lanjut (Merah / Default)</option>
              <option value="SP DEFAULT"> SP Default (Macet)</option>
              <option value="SP"> Ada Surat Peringatan (SP 1-3)</option>
              <option value="SP 1">SP 1 Saja</option>
              <option value="SP 2">SP 2</option>
              <option value="SP 3">SP 3</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Cepat:
          </span>
          <button
            onClick={() => { setSelectedYear('ALL'); setSelectedStatus('ALL'); setSearchTerm(''); }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              selectedYear === 'ALL' && selectedStatus === 'ALL' && !searchTerm
                ? 'bg-[#014181] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({suratList.length})
          </button>
          <button
            onClick={() => setSelectedStatus('URGENT')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition flex items-center gap-1 ${
              selectedStatus === 'URGENT'
                ? 'bg-[#FF7401] text-white shadow-xs'
                : 'bg-orange-50 text-[#FF7401] hover:bg-orange-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Tindak Lanjut ({stats.urgentCount})
          </button>
          <button
            onClick={() => setSelectedStatus('SP DEFAULT')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              selectedStatus === 'SP DEFAULT'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            SP Default ({stats.spDefaultCount})
          </button>
          <button
            onClick={() => setSelectedYear('2026')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              selectedYear === '2026'
                ? 'bg-[#014181] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tahun 2026 ({stats.yearDistribution['2026'] || 0})
          </button>
          <button
            onClick={() => setSelectedYear('2025')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              selectedYear === '2025'
                ? 'bg-[#014181] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tahun 2025 ({stats.yearDistribution['2025'] || 0})
          </button>
        </div>
      </div>

      {/* Main Table replicating Excel format */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#014181] text-white font-extrabold uppercase tracking-wider text-[11px] border-b border-[#014181]">
                <th className="py-3.5 px-4 sticky left-0 z-20 bg-[#014181] shadow-xs">
                  NAMA DEBITUR
                </th>
                <th className="py-3.5 px-3 text-center">TAHUN</th>
                <th className="py-3.5 px-3 text-center">SP 1</th>
                <th className="py-3.5 px-3 text-center">SP 2</th>
                <th className="py-3.5 px-3 text-center">SP 3</th>
                <th className="py-3.5 px-3 text-center">SP DEFAULT</th>
                <th className="py-3.5 px-4">LPJ</th>
                <th className="py-3.5 px-4">PERJANJIAN KREDIT (PK)</th>
                <th className="py-3.5 px-3 text-center">STATUS</th>
                <th className="py-3.5 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSurat.length > 0 ? (
                paginatedSurat.map((item, idx) => {
                  return (
                    <tr
                      key={item.id || idx}
                      className={`hover:bg-blue-50/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {/* NAMA */}
                      <td className="py-3 px-4 font-bold text-slate-900 sticky left-0 z-10 bg-inherit whitespace-nowrap border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#014181]"></span>
                          <span>{item.nama}</span>
                        </div>
                      </td>

                      {/* TAHUN */}
                      <td className="py-3 px-3 text-center font-semibold text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.tahun}
                        </span>
                      </td>

                      {/* SP 1 */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {item.sp1 === '-' ? (
                          <span className="text-slate-300">-</span>
                        ) : (
                          <span
                            className={`font-semibold ${
                              item.sp1Urgent
                                ? 'text-rose-600 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200'
                                : 'text-slate-700'
                            }`}
                          >
                            {item.sp1}
                          </span>
                        )}
                      </td>

                      {/* SP 2 */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {item.sp2 === '-' ? (
                          <span className="text-slate-300">-</span>
                        ) : (
                          <span
                            className={`font-semibold ${
                              item.sp2Urgent
                                ? 'text-rose-600 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200'
                                : 'text-slate-700'
                            }`}
                          >
                            {item.sp2}
                          </span>
                        )}
                      </td>

                      {/* SP 3 */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {item.sp3 === '-' ? (
                          <span className="text-slate-300">-</span>
                        ) : (
                          <span
                            className={`font-semibold ${
                              item.sp3Urgent
                                ? 'text-rose-600 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200'
                                : 'text-slate-700'
                            }`}
                          >
                            {item.sp3}
                          </span>
                        )}
                      </td>

                      {/* SP DEFAULT */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {item.spDefault === '-' ? (
                          <span className="text-slate-300">-</span>
                        ) : (
                          <span className="font-bold text-rose-700 px-2 py-0.5 rounded bg-rose-100/80 border border-rose-300">
                            {item.spDefault}
                          </span>
                        )}
                      </td>

                      {/* LPJ */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`underline decoration-dotted cursor-pointer transition ${
                            item.lpjUrgent
                              ? 'text-rose-600 font-bold hover:text-rose-800'
                              : 'text-[#014181] hover:text-[#FF7401]'
                          }`}
                          onClick={() => handleOpenDetail(item)}
                          title="Klik untuk detail berkas LPJ"
                        >
                          {item.lpj || '-'}
                        </span>
                      </td>

                      {/* PK */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`underline decoration-dotted cursor-pointer transition ${
                            item.pkUrgent
                              ? 'text-rose-600 font-bold hover:text-rose-800'
                              : 'text-emerald-700 hover:text-[#014181]'
                          }`}
                          onClick={() => handleOpenDetail(item)}
                          title="Klik untuk detail Perjanjian Kredit"
                        >
                          {item.pk || '-'}
                        </span>
                      </td>

                      {/* STATUS BADGE */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                            item.spDefault !== '-'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : item.sp3 !== '-'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : item.sp2 !== '-'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : item.sp1 !== '-'
                              ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {item.status || 'Normal'}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="p-1.5 text-slate-500 hover:text-[#014181] hover:bg-blue-50 rounded-lg transition"
                            title="Lihat Detail Lengkap"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-[#FF7401] hover:bg-orange-50 rounded-lg transition"
                            title="Edit Data Surat"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Hapus Data Surat (Khusus Admin)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-500">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">
                      Tidak ada data surat yang cocok
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba ganti kata kunci pencarian atau sesuaikan filter tahun & status.
                    </p>
                    <button
                      onClick={() => { setSelectedYear('ALL'); setSelectedStatus('ALL'); setSearchTerm(''); }}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-blue-50 text-[#014181] font-bold text-xs hover:bg-blue-100 transition"
                    >
                      Bersihkan Semua Filter
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Status Legend */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <span>Teks Merah: Perlu Verifikasi / Macet</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#014181]"></span>
              <span>Biru: Dokumen Terarsip Normal</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Total Database: <strong className="text-slate-700">{suratList.length}</strong> arsip terdaftar
          </div>
        </div>

        {/* Pagination Bar (Default 10 Surat per Lembar) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Info Summary & Page Size Selector */}
          <div className="flex flex-wrap items-center gap-3 text-slate-600">
            <span>
              Menampilkan{' '}
              <strong className="text-slate-900 font-bold">
                {totalItems > 0 ? startIndex + 1 : 0} - {endIndex}
              </strong>{' '}
              dari <strong className="text-slate-900 font-bold">{totalItems}</strong> surat
              <span className="text-slate-400 ml-1.5">
                (Lembar <strong className="text-slate-800">{currentPage}</strong> dari{' '}
                <strong className="text-slate-800">{totalPages}</strong>)
              </span>
            </span>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Tampilkan:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#014181]/20 cursor-pointer"
              >
                <option value={10}>10 surat / lembar</option>
                <option value={20}>20 surat / lembar</option>
                <option value={50}>50 surat / lembar</option>
                <option value={100}>100 surat / lembar</option>
              </select>
            </div>
          </div>

          {/* Navigation Buttons */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
                title="Lembar Pertama"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition font-semibold text-xs"
                title="Lembar Sebelumnya"
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
                title="Lembar Selanjutnya"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
                title="Lembar Terakhir"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Tambah Debitur & Surat Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#014181] text-white">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Input Arsip Surat Debitur Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pencatatan SP 1, SP 2, SP 3, SP Default, LPJ, & PK
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Debitur / CV / PT *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: PT Sriwijaya Mandiri / Budi Santoso"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun Kredit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tanggal Surat Peringatan */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <span className="text-xs font-bold text-[#014181] uppercase tracking-wider block">
                  Tanggal Surat Peringatan (Ketik tanggal atau isi '-' jika belum ada)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal SP 1
                    </label>
                    <input
                      type="text"
                      value={formData.sp1}
                      onChange={(e) => setFormData({ ...formData, sp1: e.target.value })}
                      placeholder="01-Mar-26 atau -"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                    <label className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sp1Urgent}
                        onChange={(e) => setFormData({ ...formData, sp1Urgent: e.target.checked })}
                      />
                      <span>Tandai Merah / Urgent</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal SP 2
                    </label>
                    <input
                      type="text"
                      value={formData.sp2}
                      onChange={(e) => setFormData({ ...formData, sp2: e.target.value })}
                      placeholder="15-Apr-26 atau -"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal SP 3
                    </label>
                    <input
                      type="text"
                      value={formData.sp3}
                      onChange={(e) => setFormData({ ...formData, sp3: e.target.value })}
                      placeholder="02-May-26 atau -"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                    <label className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sp3Urgent}
                        onChange={(e) => setFormData({ ...formData, sp3Urgent: e.target.checked })}
                      />
                      <span>Tandai Merah / Urgent</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal SP DEFAULT
                    </label>
                    <input
                      type="text"
                      value={formData.spDefault}
                      onChange={(e) => setFormData({ ...formData, spDefault: e.target.value })}
                      placeholder="19-Jun-26 atau -"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dokumen LPJ & PK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Format Dokumen LPJ
                  </label>
                  <input
                    type="text"
                    value={formData.lpj}
                    onChange={(e) => setFormData({ ...formData, lpj: e.target.value })}
                    placeholder="Kosongkan untuk otomatis LPJ - [NAMA]"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                  <label className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.lpjUrgent}
                      onChange={(e) => setFormData({ ...formData, lpjUrgent: e.target.checked })}
                    />
                    <span>Perlu Verifikasi Fisik LPJ (Merah)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Format Perjanjian Kredit (PK)
                  </label>
                  <input
                    type="text"
                    value={formData.pk}
                    onChange={(e) => setFormData({ ...formData, pk: e.target.value })}
                    placeholder="Kosongkan untuk otomatis PK - [NAMA]"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                  <label className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pkUrgent}
                      onChange={(e) => setFormData({ ...formData, pkUrgent: e.target.checked })}
                    />
                    <span>Perlu Verifikasi Fisik PK (Merah)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Petugas / Status Khusus
                </label>
                <textarea
                  rows="2"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  placeholder="Catatan penagihan, status agunan, atau lokasi map arsip..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                ></textarea>
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
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#014181] hover:bg-[#002d5b] rounded-xl shadow-md"
                >
                  Simpan ke Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Debitur & Surat */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FF7401] text-white">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Perbarui Data Surat: {formData.nama}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID: {selectedItem?.id} • Tahun: {formData.tahun}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAdmin && (
              <div className="mt-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#FF7401] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Wewenang Edit Terbatas (Role Staff)</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Sesuai SOP pembagian wewenang, Anda dapat memperbarui tanggal tindak lanjut surat (SP 1–Default, LPJ, PK) dan catatan penagihan. Pengubahan identitas pokok Nama Debitur & Tahun dikunci khusus role Admin Kredit.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Nama Debitur / Badan Usaha
                    </label>
                    {!isAdmin && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded">
                        Dikunci (Staff)
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      !isAdmin
                        ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
                        : 'border-slate-200 bg-white'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Tahun Kredit
                    </label>
                    {!isAdmin && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded">
                        Dikunci
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      !isAdmin
                        ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
                        : 'border-slate-200 bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Tanggal SP */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                <span className="text-xs font-bold text-[#014181] uppercase tracking-wider block">
                  Perbarui Tanggal Surat Peringatan
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal SP 1
                    </label>
                    <input
                      type="text"
                      value={formData.sp1}
                      onChange={(e) => setFormData({ ...formData, sp1: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                    <label className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sp1Urgent}
                        onChange={(e) => setFormData({ ...formData, sp1Urgent: e.target.checked })}
                      />
                      <span>Tandai Merah / Urgent</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal SP 2
                    </label>
                    <input
                      type="text"
                      value={formData.sp2}
                      onChange={(e) => setFormData({ ...formData, sp2: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal SP 3
                    </label>
                    <input
                      type="text"
                      value={formData.sp3}
                      onChange={(e) => setFormData({ ...formData, sp3: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                    <label className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sp3Urgent}
                        onChange={(e) => setFormData({ ...formData, sp3Urgent: e.target.checked })}
                      />
                      <span>Tandai Merah / Urgent</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal SP DEFAULT
                    </label>
                    <input
                      type="text"
                      value={formData.spDefault}
                      onChange={(e) => setFormData({ ...formData, spDefault: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dokumen LPJ & PK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dokumen LPJ
                  </label>
                  <input
                    type="text"
                    value={formData.lpj}
                    onChange={(e) => setFormData({ ...formData, lpj: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                  <label className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.lpjUrgent}
                      onChange={(e) => setFormData({ ...formData, lpjUrgent: e.target.checked })}
                    />
                    <span>Perlu Verifikasi Fisik LPJ (Merah)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dokumen PK
                  </label>
                  <input
                    type="text"
                    value={formData.pk}
                    onChange={(e) => setFormData({ ...formData, pk: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                  <label className="inline-flex items-center gap-1.5 mt-1 text-[11px] text-rose-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pkUrgent}
                      onChange={(e) => setFormData({ ...formData, pkUrgent: e.target.checked })}
                    />
                    <span>Perlu Verifikasi Fisik PK (Merah)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Khusus
                </label>
                <textarea
                  rows="2"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#FF7401] hover:bg-[#e06500] rounded-xl shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Detail Debitur & Kronologi Surat */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF7401]">
                  Arsip Surat KCP Iskandar
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {selectedItem.nama}
                </h3>
                <p className="text-xs text-slate-500">
                  Tahun Kredit: {selectedItem.tahun} • ID: {selectedItem.id}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Progress SP Timeline */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="font-bold text-[#014181] block mb-3 uppercase tracking-wider text-[11px]">
                  Kronologi Surat Peringatan (SP)
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white shadow-2xs border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold block">SP 1</span>
                    <span className={`font-bold ${selectedItem.sp1Urgent ? 'text-rose-600' : 'text-slate-800'}`}>
                      {selectedItem.sp1}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white shadow-2xs border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold block">SP 2</span>
                    <span className="font-bold text-slate-800">
                      {selectedItem.sp2}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white shadow-2xs border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold block">SP 3</span>
                    <span className={`font-bold ${selectedItem.sp3Urgent ? 'text-rose-600' : 'text-slate-800'}`}>
                      {selectedItem.sp3}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white shadow-2xs border border-blue-100">
                    <span className="text-[10px] text-slate-400 font-bold block">DEFAULT</span>
                    <span className="font-bold text-rose-600">
                      {selectedItem.spDefault}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dokumen Arsip */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#014181]" />
                    <span className="font-semibold text-slate-700">Dokumen LPJ:</span>
                  </div>
                  <span className={`font-bold ${selectedItem.lpjUrgent ? 'text-rose-600' : 'text-[#014181]'}`}>
                    {selectedItem.lpj} {selectedItem.lpjUrgent && '(Perlu Cek)'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-700">Perjanjian Kredit:</span>
                  </div>
                  <span className={`font-bold ${selectedItem.pkUrgent ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {selectedItem.pk} {selectedItem.pkUrgent && '(Perlu Cek)'}
                  </span>
                </div>
              </div>

              {/* Catatan Petugas */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900">
                <span className="font-bold text-[11px] block mb-1">
                  Catatan Administrasi & Penagihan:
                </span>
                <p className="text-xs leading-relaxed">
                  {selectedItem.catatan || 'Belum ada catatan tambahan untuk debitur ini.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Status: <strong className="text-slate-700">{selectedItem.status}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false)
                    handleOpenEdit(selectedItem)
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#014181] text-white text-xs font-bold hover:bg-[#002d5b]"
                >
                  Edit Data Ini
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Confirmation */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Hapus Data Arsip Surat?
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Apakah Anda yakin ingin menghapus berkas surat untuk <strong>{itemToDelete.nama}</strong> ({itemToDelete.tahun})?
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
