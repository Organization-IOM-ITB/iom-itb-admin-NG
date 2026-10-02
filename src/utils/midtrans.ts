// Pembayaran online (Midtrans) dinonaktifkan sementara selama masih sandbox.
// Default MATI; nyalakan dengan VUE_APP_MIDTRANS_ENABLED=true saat build.
// api-NG punya saklar sendiri (MIDTRANS_ENABLED) yang menolak snap-token.
export const isMidtransEnabled = (): boolean =>
  String(process.env.VUE_APP_MIDTRANS_ENABLED || '').toLowerCase() === 'true';
