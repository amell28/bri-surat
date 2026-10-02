import { initSupabaseClient } from './supabase'

const BUCKET_NAME = 'berkas_debitur'

/**
 * Upload file to Supabase Storage with graceful Base64 fallback.
 * Works seamlessly online or offline, even if bucket is not yet created.
 */
export async function uploadBerkasFisik(file, folder = 'dokumen') {
  if (!file) throw new Error('File tidak ditemukan')

  // Check file size limit (15MB)
  const MAX_SIZE_MB = 15
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Ukuran file melebihi batas ${MAX_SIZE_MB}MB.`)
  }

  const client = initSupabaseClient()
  const fileExt = file.name.split('.').pop()
  const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
  const fileName = `${folder}/${Date.now()}_${cleanBaseName}.${fileExt}`

  // 1. Try uploading to Supabase Storage if connected
  if (client) {
    try {
      const { data, error } = await client.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (!error && data?.path) {
        const { data: publicUrlData } = client.storage
          .from(BUCKET_NAME)
          .getPublicUrl(data.path)

        return {
          success: true,
          url: publicUrlData.publicUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          storageType: 'supabase_storage',
          uploadedAt: new Date().toISOString()
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, using base64 fallback:', err.message)
    }
  }

  // 2. Fallback to Base64 Data URL (stored locally in DB / localStorage)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        success: true,
        url: reader.result,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageType: 'base64_data',
        uploadedAt: new Date().toISOString()
      })
    }
    reader.onerror = () => reject(new Error('Gagal membaca file lokal.'))
    reader.readAsDataURL(file)
  })
}

/**
 * Format bytes to readable size (KB / MB)
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
