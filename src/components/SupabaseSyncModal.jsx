import { useState, useEffect } from 'react'
import {
  Database,
  CloudUpload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  X,
  Key,
  Globe,
  Trash2,
  Sparkles
} from 'lucide-react'
import { useSurat } from '../context/SuratContext'

export default function SupabaseSyncModal({ isOpen, onClose }) {
  const {
    syncStatus,
    supabaseMessage,
    isConfigured,
    loading,
    uploadAllToSupabase,
    fetchFromSupabase,
    connectSupabase,
    disconnectSupabase,
    getSupabaseConfig
  } = useSurat()

  const config = getSupabaseConfig()
  const [url, setUrl] = useState(config.url || '')
  const [anonKey, setAnonKey] = useState(config.anonKey || '')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const current = getSupabaseConfig()
    setUrl(current.url || '')
    setAnonKey(current.anonKey || '')
  }, [isOpen])

  if (!isOpen) return null

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSaveConnection = async (e) => {
    e.preventDefault()
    setMessage('Menghubungkan ke Supabase...')
    setIsSuccess(false)

    const res = await connectSupabase(url, anonKey)
    if (res.success) {
      setIsSuccess(true)
      setMessage(res.message)
    } else {
      setIsSuccess(false)
      setMessage(`Gagal konek: ${res.message}`)
    }
  }

  const handleUploadAll = async () => {
    setMessage('Mengupload seluruh data dummy ke Supabase...')
    const res = await uploadAllToSupabase()
    if (res.success) {
      setIsSuccess(true)
      setMessage(`Berhasil mengupload ${res.count} data dummy ke tabel surat_debitur di Supabase!`)
    } else {
      setIsSuccess(false)
      setMessage(`Gagal upload: ${res.message}`)
    }
  }

  const handleFetch = async () => {
    setMessage('Memuat data terbaru dari Supabase...')
    const ok = await fetchFromSupabase()
    if (ok) {
      setIsSuccess(true)
      setMessage('Data dari Supabase berhasil disinkronkan!')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#014181] text-white shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Integrasi Database Supabase
              </h3>
              <p className="text-xs text-slate-500">
                BRI KCP Iskandar Palembang • Cloud Database Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className="mt-5 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-500">Status Saat Ini:</span>
            <div className="font-black text-[#014181] text-sm mt-0.5 flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{syncStatus}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConfigured && (
              <>
                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-[#014181] font-bold text-xs hover:bg-blue-50 shadow-2xs flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Tarik Data</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Message Banner */}
        {(message || supabaseMessage) && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${isSuccess
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
          >
            {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message || supabaseMessage}</span>
          </div>
        )}

        {/* Form Connect Credentials */}
        <form onSubmit={handleSaveConnection} className="mt-5 space-y-3.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Pengaturan Kredensial Supabase
          </span>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supabase Project URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxxxxx.supabase.co"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none"
                required
              />
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Bisa diisi di sini atau diletakkan di file <code>.env</code> (VITE_SUPABASE_URL).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supabase Anon Key (Public Key)
            </label>
            <div className="relative">
              <input
                type="text"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#014181] focus:outline-none"
                required
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isConfigured ? (
              <button
                type="button"
                onClick={disconnectSupabase}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Putus Koneksi
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#014181] hover:bg-[#002d5b] rounded-xl shadow-md transition"
            >
              Simpan & Hubungkan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
