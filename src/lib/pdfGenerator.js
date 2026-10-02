import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Generate Rekapitulasi Berkas Surat Debitur (Landscape A4)
 */
export function exportRekapToPdf(suratList = [], filterInfo = {}, currentUser = null) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Top Accent Bar (BRI Blue & Orange)
  doc.setFillColor(1, 65, 129) // #014181
  doc.rect(0, 0, pageWidth, 5, 'F')
  doc.setFillColor(255, 116, 1) // #FF7401
  doc.rect(0, 5, pageWidth, 1.5, 'F')

  // Header Text
  doc.setTextColor(1, 65, 129)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('PT. BANK RAKYAT INDONESIA (PERSERO) Tbk.', 14, 15)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(51, 65, 85)
  doc.text('KANTOR CABANG PEMBANTU (KCP) ISKANDAR PALEMBANG', 14, 20)

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('Sistem Informasi Arsip & Penelusuran Surat Debitur (SP 1, SP 2, SP 3, SP Default, LPJ, PK)', 14, 24.5)

  // Document Title Box (Right aligned)
  doc.setFillColor(241, 245, 249)
  doc.roundedRect(pageWidth - 95, 10, 81, 16, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(1, 65, 129)
  doc.text('LAPORAN REKAPITULASI BERKAS', pageWidth - 91, 15)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(71, 85, 105)
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  doc.text(`Tanggal Cetak : ${todayStr}`, pageWidth - 91, 19.5)
  doc.text(`Total Berkas   : ${suratList.length} Debitur`, pageWidth - 91, 23.5)

  // Separator Line
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.4)
  doc.line(14, 28, pageWidth - 14, 28)

  // Filter Information Sub-bar
  if (filterInfo.year || filterInfo.status || filterInfo.search) {
    const filterText = [
      filterInfo.search ? `Cari: "${filterInfo.search}"` : null,
      filterInfo.year && filterInfo.year !== 'ALL' ? `Tahun: ${filterInfo.year}` : null,
      filterInfo.status && filterInfo.status !== 'ALL' ? `Filter: ${filterInfo.status}` : null
    ].filter(Boolean).join(' | ')

    doc.setFontSize(7.5)
    doc.setTextColor(100, 116, 139)
    doc.text(`Kriteria Saringan: ${filterText}`, 14, 32.5)
  }

  // Table Data Preparation
  const tableRows = suratList.map((item, index) => {
    const lampiranCount = (item.lampiran && Array.isArray(item.lampiran)) ? item.lampiran.length : 0
    const lampiranStr = lampiranCount > 0 ? `Ada (${lampiranCount})` : '-'

    return [
      index + 1,
      item.nama || '-',
      item.tahun || '-',
      item.sp1 || '-',
      item.sp2 || '-',
      item.sp3 || '-',
      item.spDefault || '-',
      item.lpj || '-',
      item.pk || '-',
      item.status || 'Normal',
      lampiranStr
    ]
  })

  // Render Table
  autoTable(doc, {
    startY: 35,
    margin: { left: 14, right: 14 },
    head: [[
      'NO',
      'NAMA DEBITUR',
      'TAHUN',
      'SP 1',
      'SP 2',
      'SP 3',
      'SP DEFAULT',
      'LPJ',
      'PERJANJIAN KREDIT',
      'STATUS',
      'FILE'
    ]],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      textColor: [30, 41, 59]
    },
    headStyles: {
      fillColor: [1, 65, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { fontStyle: 'bold', cellWidth: 42 },
      2: { halign: 'center', cellWidth: 14 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'center', cellWidth: 18 },
      5: { halign: 'center', cellWidth: 18 },
      6: { halign: 'center', cellWidth: 22 },
      7: { cellWidth: 38 },
      8: { cellWidth: 38 },
      9: { halign: 'center', cellWidth: 26 },
      10: { halign: 'center', cellWidth: 18 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (data) => {
      // Highlight SP Default rows or cells
      if (data.column.index === 6 && data.cell.text[0] !== '-') {
        data.cell.styles.textColor = [190, 18, 60] // Rose 700
        data.cell.styles.fontStyle = 'bold'
      }
      if (data.column.index === 9) {
        const text = data.cell.text[0] || ''
        if (text === 'SP DEFAULT') {
          data.cell.styles.textColor = [190, 18, 60]
          data.cell.styles.fontStyle = 'bold'
        } else if (text.includes('SP')) {
          data.cell.styles.textColor = [217, 119, 6] // Amber 600
        } else {
          data.cell.styles.textColor = [5, 150, 105] // Emerald 600
        }
      }
    }
  })

  // Signatures on last page
  let finalY = doc.lastAutoTable.finalY + 8
  if (finalY > pageHeight - 38) {
    doc.addPage()
    finalY = 20
  }

  const signWidth = 65
  const leftX = 20
  const rightX = pageWidth - signWidth - 20

  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)

  // Left Signature (Petugas Administrasi Kredit)
  doc.text('Dipersiapkan Oleh,', leftX, finalY)
  doc.text('Petugas Administrasi Kredit', leftX, finalY + 4)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(currentUser?.nama || 'Petugas Administrasi', leftX, finalY + 22)
  doc.setLineWidth(0.2)
  doc.line(leftX, finalY + 23, leftX + signWidth - 10, finalY + 23)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text(`Personal Number (PN): ${currentUser?.pn || '-'}`, leftX, finalY + 26)

  // Right Signature (Supervisor Bisnis & Kredit)
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text(`Palembang, ${todayStr}`, rightX, finalY)
  doc.text('Supervisor Bisnis & Kredit', rightX, finalY + 4)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Ahmad Fauzan, S.E.', rightX, finalY + 22)
  doc.line(rightX, finalY + 23, rightX + signWidth - 10, finalY + 23)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text('Personal Number (PN): 00154829', rightX, finalY + 26)

  // Page Numbers in Footer
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text(
      `Halaman ${i} dari ${totalPages} • Dokumen Resmi BRI KCP Iskandar Palembang`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    )
  }

  // Save PDF
  const filename = `BRI_KCP_Iskandar_Arsip_Surat_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
  return filename
}

/**
 * Generate Lembar Kontrol & Disposisi Individual Debitur (Portrait A4)
 */
export function exportDebiturDetailToPdf(item, currentUser = null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Top Accent Bar
  doc.setFillColor(1, 65, 129)
  doc.rect(0, 0, pageWidth, 5, 'F')
  doc.setFillColor(255, 116, 1)
  doc.rect(0, 5, pageWidth, 1.5, 'F')

  // Header
  doc.setTextColor(1, 65, 129)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('PT. BANK RAKYAT INDONESIA (PERSERO) Tbk.', 14, 15)

  doc.setFontSize(10)
  doc.setTextColor(51, 65, 85)
  doc.text('KANTOR CABANG PEMBANTU (KCP) ISKANDAR PALEMBANG', 14, 20)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('Unit Supervisi & Administrasi Kredit • Lembar Kontrol Arsip Surat', 14, 24)

  // Title Box
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.3)
  doc.roundedRect(14, 28, pageWidth - 28, 14, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(1, 65, 129)
  doc.text('KARTU KONTROL & DISPOSISI ARSIP SURAT DEBITUR', pageWidth / 2, 35, { align: 'center' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text(`ID Berkas: ${item.id || '-'} • Dibuat Otomatis dari Sistem Informasi Arsip`, pageWidth / 2, 39, { align: 'center' })

  // SECTION 1: Identitas Pokok Debitur
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(1, 65, 129)
  doc.text('I. IDENTITAS DEBITUR', 14, 49)

  const identitasData = [
    ['Nama Debitur / Usaha', `: ${item.nama || '-'}`],
    ['Tahun Akad Kredit', `: ${item.tahun || '-'}`],
    ['Status Kolektibilitas / Berkas', `: ${item.status || 'Normal'}`],
    ['Nomor Dokumen LPJ', `: ${item.lpj || '-'}`],
    ['Nomor Perjanjian Kredit (PK)', `: ${item.pk || '-'}`]
  ]

  autoTable(doc, {
    startY: 51,
    margin: { left: 14, right: 14 },
    body: identitasData,
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: 1.5,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55, textColor: [71, 85, 105] },
      1: { cellWidth: 'auto', fontStyle: 'bold', textColor: [15, 23, 42] }
    }
  })

  // SECTION 2: Matriks Kronologi Surat Peringatan (SP)
  let y = doc.lastAutoTable.finalY + 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(1, 65, 129)
  doc.text('II. KRONOLOGI SURAT PERINGATAN (SP)', 14, y)

  const spData = [
    [
      'Surat Peringatan 1 (SP 1)',
      item.sp1 || '-',
      item.sp1Urgent ? 'Perhatian Khusus (Urgent)' : (item.sp1 !== '-' ? 'Tercatat Terkirim' : 'Belum Ada SP')
    ],
    [
      'Surat Peringatan 2 (SP 2)',
      item.sp2 || '-',
      item.sp2Urgent ? 'Perhatian Khusus (Urgent)' : (item.sp2 !== '-' ? 'Tercatat Terkirim' : 'Belum Ada SP')
    ],
    [
      'Surat Peringatan 3 (SP 3)',
      item.sp3 || '-',
      item.sp3Urgent ? 'Perhatian Khusus (Urgent)' : (item.sp3 !== '-' ? 'Tercatat Terkirim' : 'Belum Ada SP')
    ],
    [
      'Surat Peringatan Default (Macet)',
      item.spDefault || '-',
      item.spDefault !== '-' ? 'Kredit Bermasalah / NPL' : 'Tidak Default'
    ]
  ]

  autoTable(doc, {
    startY: y + 2,
    margin: { left: 14, right: 14 },
    head: [['Jenis Dokumen', 'Nomor / Tanggal Surat', 'Keterangan Status']],
    body: spData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [226, 232, 240]
    },
    headStyles: {
      fillColor: [1, 65, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { halign: 'center', cellWidth: 50 },
      2: { cellWidth: 'auto' }
    }
  })

  // SECTION 3: Berkas Fisik & Dokumen Scan Terlampir
  y = doc.lastAutoTable.finalY + 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(1, 65, 129)
  doc.text('III. BERKAS FISIK & DOKUMEN SCAN TERLAMPIR', 14, y)

  const lampiranList = (item.lampiran && Array.isArray(item.lampiran) && item.lampiran.length > 0)
    ? item.lampiran.map((l, i) => [
        i + 1,
        l.nama_file || 'Dokumen Scan',
        l.tipe || 'Dokumen',
        l.ukuran ? `${Math.round(l.ukuran / 1024)} KB` : '-',
        l.diupload_pada ? new Date(l.diupload_pada).toLocaleDateString('id-ID') : '-'
      ])
    : [['-', 'Belum ada file fisik diunggah ke arsip debitur ini.', '-', '-', '-']]

  autoTable(doc, {
    startY: y + 2,
    margin: { left: 14, right: 14 },
    head: [['No', 'Nama Berkas', 'Kategori', 'Ukuran', 'Tanggal Upload']],
    body: lampiranList,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 1.8 },
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 70 },
      2: { cellWidth: 35 },
      3: { halign: 'center', cellWidth: 25 },
      4: { halign: 'center', cellWidth: 30 }
    }
  })

  // SECTION 4: Catatan Administrasi Penagihan
  y = doc.lastAutoTable.finalY + 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(1, 65, 129)
  doc.text('IV. CATATAN ADMINISTRASI & PENAGIHAN', 14, y)

  doc.setFillColor(254, 243, 199) // amber 100
  doc.setDrawColor(251, 191, 36)
  doc.roundedRect(14, y + 2, pageWidth - 28, 14, 1.5, 1.5, 'FD')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(120, 53, 15)
  const catatanLines = doc.splitTextToSize(item.catatan || 'Belum ada catatan khusus untuk debitur ini.', pageWidth - 34)
  doc.text(catatanLines, 18, y + 7)

  // SECTION 5: Log Riwayat Pembaruan Terakhir (Audit Trail)
  y = y + 20
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(1, 65, 129)
  doc.text('V. RIWAYAT PEMBARUAN TERAKHIR (AUDIT TRAIL)', 14, y)

  const logs = (item.riwayat_log && Array.isArray(item.riwayat_log) && item.riwayat_log.length > 0)
    ? item.riwayat_log.slice(0, 4).map((lg, i) => [
        i + 1,
        lg.timestamp ? new Date(lg.timestamp).toLocaleString('id-ID') : '-',
        lg.staf || lg.oleh || 'Staf BRI',
        lg.aksi || 'Pembaruan',
        lg.detail || lg.catatan || '-'
      ])
    : [[1, new Date().toLocaleDateString('id-ID'), 'Sistem Arsip', 'Pendaftaran Awal', 'Arsip surat debitur tercatat di database']]

  autoTable(doc, {
    startY: y + 2,
    margin: { left: 14, right: 14 },
    head: [['No', 'Waktu (WIB)', 'Staf Pelaksana', 'Aktivitas', 'Keterangan']],
    body: logs,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 32 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      4: { cellWidth: 'auto' }
    }
  })

  // Signatures on bottom
  y = doc.lastAutoTable.finalY + 8
  if (y > pageHeight - 35) {
    doc.addPage()
    y = 20
  }

  const signWidth = 65
  const leftX = 20
  const rightX = pageWidth - signWidth - 20
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)

  doc.text('Dipersiapkan Oleh,', leftX, y)
  doc.text('Petugas Administrasi Kredit', leftX, y + 4)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(currentUser?.nama || 'Petugas Administrasi', leftX, y + 20)
  doc.line(leftX, y + 21, leftX + signWidth - 10, y + 21)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text(`PN: ${currentUser?.pn || '-'}`, leftX, y + 24)

  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text(`Palembang, ${todayStr}`, rightX, y)
  doc.text('Supervisor Bisnis & Kredit', rightX, y + 4)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Ahmad Fauzan, S.E.', rightX, y + 20)
  doc.line(rightX, y + 21, rightX + signWidth - 10, y + 21)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text('PN: 00154829', rightX, y + 24)

  // Footer text
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.text(
    'PT Bank Rakyat Indonesia (Persero) Tbk — KCP Iskandar Palembang • Lembar Disposisi Arsip',
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  )

  const cleanName = (item.nama || 'Debitur').replace(/[^a-zA-Z0-9]/g, '_')
  const filename = `Lembar_Kontrol_${cleanName}.pdf`
  doc.save(filename)
  return filename
}
