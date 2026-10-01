import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initialSuratList } from '../data/initialSuratData'
import {
  initSupabaseClient,
  isSupabaseConfigured,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  getSupabaseConfig
} from '../lib/supabase'

const SuratContext = createContext(null)
const STORAGE_KEY = 'bri_surat_dummy_data_v2'

export function SuratProvider({ children }) {
  const [suratList, setSuratList] = useState(() => {
    // Clean up old legacy keys
    localStorage.removeItem('bri_surat_data')

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch (e) {
        console.error('Failed to parse stored surat data', e)
      }
    }
    return initialSuratList
  })

  const [loading, setLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState(
    isSupabaseConfigured() ? 'Supabase Terhubung' : 'Lokal (Belum Sync Supabase)'
  )
  const [supabaseMessage, setSupabaseMessage] = useState('')

  // Normalizer from DB row to app format
  const normalizeRow = (row) => ({
    id: row.id,
    nama: row.nama,
    tahun: row.tahun,
    sp1: row.sp1 || '-',
    sp1Urgent: Boolean(row.sp1_urgent ?? row.sp1Urgent),
    sp2: row.sp2 || '-',
    sp2Urgent: Boolean(row.sp2_urgent ?? row.sp2Urgent),
    sp3: row.sp3 || '-',
    sp3Urgent: Boolean(row.sp3_urgent ?? row.sp3Urgent),
    spDefault: row.sp_default || row.spDefault || '-',
    spDefaultUrgent: Boolean(row.sp_default_urgent ?? row.spDefaultUrgent),
    lpj: row.lpj || '-',
    lpjUrgent: Boolean(row.lpj_urgent ?? row.lpjUrgent),
    pk: row.pk || '-',
    pkUrgent: Boolean(row.pk_urgent ?? row.pkUrgent),
    status: row.status || 'Lengkap / Normal',
    catatan: row.catatan || ''
  })

  // Denormalizer from app format to DB row
  const toDbRow = (item) => ({
    id: item.id,
    nama: item.nama,
    tahun: item.tahun,
    sp1: item.sp1 || '-',
    sp1_urgent: Boolean(item.sp1Urgent),
    sp2: item.sp2 || '-',
    sp2_urgent: Boolean(item.sp2Urgent),
    sp3: item.sp3 || '-',
    sp3_urgent: Boolean(item.sp3Urgent),
    sp_default: item.spDefault || '-',
    sp_default_urgent: Boolean(item.spDefaultUrgent),
    lpj: item.lpj || '-',
    lpj_urgent: Boolean(item.lpjUrgent),
    pk: item.pk || '-',
    pk_urgent: Boolean(item.pkUrgent),
    status: item.status || 'Lengkap / Normal',
    catatan: item.catatan || ''
  })

  // Fetch data from Supabase
  const fetchFromSupabase = useCallback(async () => {
    const client = initSupabaseClient()
    if (!client) {
      setSyncStatus('Lokal (Belum Sync Supabase)')
      return false
    }

    try {
      setLoading(true)
      const { data, error } = await client
        .from('surat_debitur')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.warn('Gagal memuat data dari Supabase:', error.message)
        setSyncStatus('Koneksi Supabase Error')
        setSupabaseMessage(`Error: ${error.message}`)
        return false
      }

      if (data && data.length > 0) {
        const normalized = data.map(normalizeRow)
        setSuratList(normalized)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
        setSyncStatus('Supabase Terhubung (Aktif)')
        setSupabaseMessage(`Berhasil memuat ${data.length} arsip dari Supabase!`)
        return true
      } else {
        // Table exists but is empty
        setSyncStatus('Supabase Terhubung (Tabel Kosong)')
        setSupabaseMessage('Tabel surat_debitur di Supabase masih kosong. Silakan klik tombol "Upload Data Dummy ke Supabase".')
        return false
      }
    } catch (err) {
      console.error('Error saat fetch Supabase:', err)
      setSyncStatus('Koneksi Supabase Gagal')
      setSupabaseMessage(err.message || 'Koneksi gagal.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Upload/Seed all 35 dummy data records into Supabase table
  const uploadAllToSupabase = async () => {
    const client = initSupabaseClient()
    if (!client) {
      return { success: false, message: 'Supabase belum dikonfigurasi. Masukkan URL dan Anon Key terlebih dahulu.' }
    }

    try {
      setLoading(true)
      const rows = initialSuratList.map(toDbRow)

      const { data, error } = await client
        .from('surat_debitur')
        .upsert(rows, { onConflict: 'id' })
        .select()

      if (error) {
        setSupabaseMessage(`Upload gagal: ${error.message}`)
        return { success: false, message: error.message }
      }

      // Re-fetch to confirm
      await fetchFromSupabase()
      setSupabaseMessage(`Sukses! ${rows.length} data dummy telah di-upload ke Supabase.`)
      return { success: true, count: rows.length }
    } catch (err) {
      setSupabaseMessage(`Error: ${err.message}`)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Initial load on mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchFromSupabase()
    }
  }, [fetchFromSupabase])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suratList))
  }, [suratList])

  // Helper status calculation
  function calculateStatus(item) {
    if (item.spDefault && item.spDefault !== '-') return 'SP DEFAULT'
    if (item.sp3 && item.sp3 !== '-') return 'SP 3'
    if (item.sp2 && item.sp2 !== '-') return 'SP 2'
    if (item.sp1 && item.sp1 !== '-') return 'SP 1'
    return 'Lengkap / Normal'
  }

  // Create
  const addSurat = async (newSurat) => {
    const item = {
      ...newSurat,
      id: newSurat.id || `DUMMY-${String(Date.now()).slice(-4)}`,
      tahun: newSurat.tahun || new Date().getFullYear().toString(),
      sp1: newSurat.sp1 || '-',
      sp1Urgent: Boolean(newSurat.sp1Urgent),
      sp2: newSurat.sp2 || '-',
      sp2Urgent: Boolean(newSurat.sp2Urgent),
      sp3: newSurat.sp3 || '-',
      sp3Urgent: Boolean(newSurat.sp3Urgent),
      spDefault: newSurat.spDefault || '-',
      spDefaultUrgent: Boolean(newSurat.spDefaultUrgent),
      lpj: newSurat.lpj || `LPJ - ${newSurat.nama.toUpperCase()}`,
      lpjUrgent: Boolean(newSurat.lpjUrgent),
      pk: newSurat.pk || `PK - ${newSurat.nama.toUpperCase()}`,
      pkUrgent: Boolean(newSurat.pkUrgent),
      status: calculateStatus(newSurat),
      catatan: newSurat.catatan || 'Surat debitur baru didaftarkan.'
    }

    setSuratList((prev) => [item, ...prev])

    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('surat_debitur').insert([toDbRow(item)])
      } catch (e) {
        console.warn('Supabase insert failed', e)
      }
    }

    return item
  }

  // Update
  const updateSurat = async (id, updatedFields) => {
    const updatedStatus = calculateStatus(updatedFields)
    const payload = {
      ...updatedFields,
      status: updatedFields.status || updatedStatus
    }

    setSuratList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
    )

    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('surat_debitur').update(toDbRow({ ...payload, id })).eq('id', id)
      } catch (e) {
        console.warn('Supabase update failed', e)
      }
    }
  }

  // Delete
  const deleteSurat = async (id) => {
    setSuratList((prev) => prev.filter((item) => item.id !== id))

    const client = initSupabaseClient()
    if (client) {
      try {
        await client.from('surat_debitur').delete().eq('id', id)
      } catch (e) {
        console.warn('Supabase delete failed', e)
      }
    }
  }

  // Reset to original dummy data
  const resetToExcelInitial = () => {
    setSuratList(initialSuratList)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSuratList))
  }

  // Connect credentials from UI
  const connectSupabase = async (url, anonKey) => {
    saveSupabaseCredentials(url, anonKey)
    const testResult = await testSupabaseConnection()
    if (testResult.success) {
      setSyncStatus('Supabase Terhubung')
      await fetchFromSupabase()
      return { success: true, message: 'Koneksi ke Supabase berhasil!' }
    } else {
      setSyncStatus('Supabase Gagal Konek')
      return { success: false, message: testResult.message }
    }
  }

  // Disconnect
  const disconnectSupabase = () => {
    clearSupabaseCredentials()
    setSyncStatus('Lokal (Belum Sync Supabase)')
    setSupabaseMessage('Koneksi Supabase diputus. Menggunakan mode lokal.')
  }

  // Export to CSV
  const exportToCsv = (filteredData = suratList) => {
    const headers = ['ID', 'NAMA DEBITUR', 'TAHUN', 'SP 1', 'SP 2', 'SP 3', 'SP DEFAULT', 'LPJ', 'PERJANJIAN KREDIT', 'STATUS', 'CATATAN']
    
    const rows = filteredData.map((s) => [
      `"${s.id || ''}"`,
      `"${s.nama || ''}"`,
      `"${s.tahun || ''}"`,
      `"${s.sp1 || '-'}"`,
      `"${s.sp2 || '-'}"`,
      `"${s.sp3 || '-'}"`,
      `"${s.spDefault || '-'}"`,
      `"${s.lpj || '-'}"`,
      `"${s.pk || '-'}"`,
      `"${s.status || '-'}"`,
      `"${(s.catatan || '').replace(/"/g, '""')}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `BRI_KCP_Iskandar_Arsip_Surat_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Summary Metrics
  const stats = {
    total: suratList.length,
    sp1Count: suratList.filter(s => s.sp1 && s.sp1 !== '-').length,
    sp2Count: suratList.filter(s => s.sp2 && s.sp2 !== '-').length,
    sp3Count: suratList.filter(s => s.sp3 && s.sp3 !== '-').length,
    spDefaultCount: suratList.filter(s => s.spDefault && s.spDefault !== '-').length,
    urgentCount: suratList.filter(s => s.sp1Urgent || s.sp3Urgent || s.lpjUrgent || s.pkUrgent || s.spDefaultUrgent).length,
    tahunList: Array.from(new Set(suratList.map(s => s.tahun))).filter(Boolean).sort((a, b) => b - a),
    yearDistribution: suratList.reduce((acc, curr) => {
      const yr = curr.tahun || 'Lainnya'
      acc[yr] = (acc[yr] || 0) + 1
      return acc
    }, {})
  }

  return (
    <SuratContext.Provider
      value={{
        suratList,
        loading,
        syncStatus,
        supabaseMessage,
        isConfigured: isSupabaseConfigured(),
        stats,
        addSurat,
        updateSurat,
        deleteSurat,
        resetToExcelInitial,
        exportToCsv,
        fetchFromSupabase,
        uploadAllToSupabase,
        connectSupabase,
        disconnectSupabase,
        getSupabaseConfig
      }}
    >
      {children}
    </SuratContext.Provider>
  )
}

export const useSurat = () => {
  const context = useContext(SuratContext)
  if (!context) {
    throw new Error('useSurat must be used within a SuratProvider')
  }
  return context
}
