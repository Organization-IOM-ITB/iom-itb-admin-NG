import type { Merchandise, SelectedMerchandiseOption, TransactionItem } from '@/types/domain';

type OrderLike = {
  merchandiseId?: number;
  merchandises?: Merchandise;
  qty?: number;
  grossAmount?: number | string | null;
  shippingCost?: number | string | null;
  selectedOptions?: SelectedMerchandiseOption[] | null;
  items?: TransactionItem[];
};

/**
 * Isi pesanan. API mengirim `items` untuk semua pesanan; respons lama tanpa
 * items dibentuk jadi satu item dari kolom produk tunggal.
 */
export const orderItems = (trx: OrderLike): TransactionItem[] => {
  if (Array.isArray(trx.items) && trx.items.length) return trx.items;
  const qty = Number(trx.qty || 0);
  const gross = trx.grossAmount != null && trx.grossAmount !== '' ? Number(trx.grossAmount) : null;
  return [{
    merchandiseId: trx.merchandiseId ?? null,
    merchandiseName: trx.merchandises?.name || `Merchandise #${trx.merchandiseId || '-'}`,
    unitPrice: gross != null && qty > 0
      ? (gross - Number(trx.shippingCost || 0)) / qty
      : Number(trx.merchandises?.price || 0),
    qty,
    selectedOptions: trx.selectedOptions || null,
  }];
};

export const itemName = (item: TransactionItem) =>
  item.merchandiseName || item.merchandise?.name || `Merchandise #${item.merchandiseId || '-'}`;

// "Navy · Panjang · XL"
export const itemOptionsValues = (item: TransactionItem) =>
  (item.selectedOptions || []).map((o) => o.value).join(' · ');

// "Warna: Navy, Size: XL"
export const itemOptionsText = (item: TransactionItem) =>
  (item.selectedOptions || []).map((o) => `${o.name}: ${o.value}`).join(', ');

export const orderTotalQty = (trx: OrderLike) =>
  orderItems(trx).reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
