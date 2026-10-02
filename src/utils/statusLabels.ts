export const STATUS_LABELS: Record<string, string> = {
  TIDAK_DIKETAHUI: 'Status Tidak Diketahui',
  VERIFIKASI_BERKAS: 'Verifikasi Berkas',
  DIPANGGIL_WAWANCARA: 'Dipanggil Wawancara',
  KEPUTUSAN_DITERIMA: 'Keputusan Diterima',
  KEPUTUSAN_DITOLAK: 'Keputusan Ditolak',
}

// Status pembayaran (Donations / Transactions) — nilai di DB mengikuti Midtrans.
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  settlement: 'Lunas',
  expired: 'Kedaluwarsa',
  failed: 'Gagal',
  refunded: 'Dikembalikan',
}

export const paymentStatusLabel = (status?: string | null): string =>
  PAYMENT_STATUS_LABELS[status || 'pending'] || status || 'Menunggu'
