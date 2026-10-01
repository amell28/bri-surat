import { createClient } from '@supabase/supabase-js'
import { initialSuratList } from '../src/data/initialSuratData.js'

const url = 'https://yershpucmwqmgprblnac.supabase.co'
const key = 'sb_publishable_xxgvJajfTNCLo_UcjaGqiA_5KlsSAOD'
const supabase = createClient(url, key)

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

async function seed() {
  console.log(`Membersihkan ID lama dan mengupload ${initialSuratList.length} data dengan ID SURAT-...`)
  
  // Clean up any old DUMMY- prefixed rows
  try {
    await supabase.from('surat_debitur').delete().like('id', 'DUMMY-%')
  } catch (err) {
    console.warn('Note:', err.message)
  }

  const rows = initialSuratList.map(toDbRow)

  const { data, error } = await supabase
    .from('surat_debitur')
    .upsert(rows, { onConflict: 'id' })
    .select()

  if (error) {
    console.error('❌ Gagal upload ke Supabase:', error.message)
    process.exit(1)
  }

  console.log(`✅ Berhasil mengupload ${data.length} baris data dengan ID SURAT-... ke Supabase!`)
}

seed()
