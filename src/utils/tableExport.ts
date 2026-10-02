// Export tabel ke CSV / XLSX di sisi browser.
//
// Satu definisi kolom dipakai untuk kedua format agar isi file selalu sama.
// `value` boleh mengembalikan number/Date — XLSX menyimpannya sebagai tipe
// aslinya (bisa dijumlah/disortir di Excel), CSV menuliskannya sebagai teks.

export type ExportValue = string | number | Date | null | undefined;

export interface ExportColumn<T> {
  header: string;
  value: (row: T, index: number) => ExportValue;
  /** Lebar kolom XLSX, dalam "karakter". */
  width?: number;
  /** Format angka/tanggal XLSX, mis. '#,##0' atau 'dd/mm/yyyy hh:mm'. */
  format?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

const formatDateForCsv = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

// Cegah CSV/formula injection: sel yang diawali karakter ini dieksekusi
// sebagai formula oleh Excel/Sheets (OWASP). Data pembeli (nama, alamat,
// catatan) diketik bebas oleh publik, jadi wajib dinetralkan.
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

const toCsvCell = (value: ExportValue): string => {
  if (value == null) return '';
  let text = value instanceof Date ? formatDateForCsv(value) : String(value);
  if (typeof value === 'string' && FORMULA_PREFIX.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

// Excel tidak mengenal zona waktu: sel tanggal adalah jam dinding apa adanya.
// write-excel-file mengonversi Date memakai UTC, sehingga 13:05 WIB akan
// tertulis 06:05. Geser dulu supaya jam lokal yang tampil di Excel.
const asLocalWallClock = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000);

const triggerDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const timestampForFileName = (date = new Date()) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;

export function downloadCsv<T>(fileName: string, columns: ExportColumn<T>[], rows: T[]): void {
  const lines = [
    columns.map((column) => toCsvCell(column.header)).join(','),
    ...rows.map((row, index) => columns.map((column) => toCsvCell(column.value(row, index))).join(',')),
  ];
  // BOM agar Excel membaca UTF-8 dengan benar (nama/alamat beraksen, emoji).
  const blob = new Blob(['﻿', lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, fileName);
}

export async function downloadXlsx<T>(
  fileName: string,
  sheetName: string,
  columns: ExportColumn<T>[],
  rows: T[],
): Promise<void> {
  // Dimuat saat dibutuhkan saja, supaya tidak menambah ukuran bundle awal.
  const { default: writeXlsxFile } = await import('write-excel-file/browser');

  const header = columns.map((column) => ({ value: column.header, fontWeight: 'bold' as const }));
  const body = rows.map((row, index) =>
    columns.map((column) => {
      const raw = column.value(row, index);
      if (raw == null || raw === '') return null;
      const value = raw instanceof Date ? asLocalWallClock(raw) : raw;
      return column.format ? { value, format: column.format } : { value };
    }),
  );

  const blob = await writeXlsxFile([header, ...body], {
    sheet: sheetName,
    columns: columns.map((column) => ({ width: column.width })),
    stickyRowsCount: 1,
  }).toBlob();

  triggerDownload(blob, fileName);
}
