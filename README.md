# IOM ITB Admin Dashboard

Dashboard admin untuk Ikatan Orangtua Mahasiswa (IOM) ITB yang dibangun dengan Vue 3, TypeScript, dan Tailwind CSS.

![Dashboard](./dashboard.png)
![Dashboard](./dashboard2.png)

## Deskripsi

Aplikasi dashboard admin untuk mengelola berbagai aspek IOM ITB, termasuk:
- Manajemen anggota dan pendataan
- Pengelolaan donasi dan dana bantuan
- Manajemen merchandise
- Pengajuan dan pengelolaan bantuan
- Program orangtua asuh
- Kegiatan dan transaksi
- Laporan dan analitik

## Fitur Utama

- **Dashboard Analytics** - Visualisasi data dengan chart dan grafik
- **Manajemen Anggota** - Pendataan dan pengelolaan anggota IOM
- **Sistem Donasi** - Pengelolaan donasi dan dana bantuan
- **Merchandise Management** - Pengelolaan produk merchandise
- **Pengajuan Bantuan** - Sistem pengajuan dan approval bantuan
- **Program Orangtua Asuh** - Manajemen program orangtua asuh
- **Kegiatan** - Pengelolaan kegiatan dan event
- **Transaksi** - Monitoring transaksi keuangan
- **Authentication** - Sistem login dengan JWT
- **Responsive Design** - Interface yang responsif untuk berbagai device

## Teknologi yang Digunakan

- **Frontend**: Vue 3 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **Charts**: ApexCharts (vue3-apexcharts)
- **HTTP Client**: Axios
- **Authentication**: JWT (jsonwebtoken)
- **Build Tool**: Vue CLI 5

## Instalasi dan Setup

### Prerequisites

- Node.js (versi 14 atau lebih tinggi)
- npm atau yarn

### Langkah Instalasi

```bash
# Clone repository
git clone <repository-url>
cd IOM-ITB-ADMIN-main

# Install dependencies
npm install
# atau
yarn install

# Compiles and hot-reloads for development
npm run serve
# atau
yarn serve

# Compiles and minifies for production
npm run build
# atau
yarn build

# Lint and fix files
npm run lint
# atau
yarn lint
```

## Struktur Project

```
src/
├── assets/          # Static assets (images, CSS)
├── components/      # Reusable Vue components
│   ├── charts/     # Chart components
│   ├── input/      # Form input components
│   ├── modal/      # Modal components
│   └── ...
├── hooks/          # Custom Vue composition API hooks
├── partials/       # Partial components
├── router/         # Vue Router configuration
├── store/          # Vuex store modules
├── utils/          # Utility functions
├── views/          # Page components
└── main.ts         # Application entry point
```

## Halaman yang Tersedia

- **Dashboard** (`/dashboard`) - Halaman utama dengan analytics
- **Login** (`/`) - Halaman autentikasi
- **Members** (`/members`) - Manajemen anggota
- **Donasi** (`/donasi`) - Pengelolaan donasi
- **Dana Bantuan** (`/dana-bantuan`) - Manajemen dana bantuan
- **Merchandise** (`/merchandise`) - Pengelolaan merchandise
- **Kegiatan** (`/kegiatan`) - Manajemen kegiatan
- **Pengajuan Bantuan** (`/pengajuan-bantuan`) - Sistem pengajuan bantuan
- **Orangtua Asuh** (`/orangtua-asuh`) - Program orangtua asuh
- **Pendataan Anggota** (`/pendataan-anggota`) - Form pendataan anggota
- **Transaksi** (`/transactions`) - Monitoring transaksi
- **Users** (`/users`) - Manajemen pengguna
- **Charts** (`/charts`) - Visualisasi data
- **UI Elements** (`/ui-elements`) - Komponen UI

## API Integration

Aplikasi menggunakan Axios untuk komunikasi dengan backend API. Semua request API dikelola melalui service layer di `src/store/api.service.ts`.

### Authentication

Sistem menggunakan JWT (JSON Web Token) untuk autentikasi. Token disimpan dalam cookies dan divalidasi pada setiap navigasi.

## Development

### Scripts yang Tersedia

- `npm run serve` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm run lint` - Linting dan fixing code

### Code Style

Project menggunakan ESLint dengan konfigurasi TypeScript dan Vue.js. Pastikan menjalankan linting sebelum commit:

```bash
npm run lint
```

## Deployment

Untuk deployment ke production:

```bash
# Build aplikasi
npm run build

# Hasil build akan tersedia di folder dist/
```

## Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Project ini dikembangkan untuk IOM ITB. Semua hak cipta dilindungi.

## Support

Untuk pertanyaan atau dukungan teknis, silakan hubungi tim development IOM ITB.

## Laporan Pengujian Fitur Halaman Fakultas (Admin)

Halaman: Menu **Fakultas** -> `/fakultas` -> `FakultasView.vue`

Catatan: Halaman ini digunakan untuk mengelola master data fakultas dan kode unik 3 digit yang dipakai sebagai referensi pada fitur donasi/iuran.

### A. Tujuan Pengujian

Memastikan fitur CRUD pada halaman Fakultas di sisi admin berjalan sesuai fungsionalitas yang diharapkan, termasuk validasi input, penanganan error, filter data, dan konsistensi data antara frontend dan backend.

### B. Rencana Pengujian

| Aspek | Detail |
| --- | --- |
| Modul yang diuji | Halaman Fakultas Admin (`/fakultas`) |
| Jenis pengujian | Pengujian Fungsional (Functional Testing) |
| Metode | Black-box testing, yaitu pengujian dilakukan berdasarkan input/output tanpa melihat implementasi internal |
| Cakupan | Create, Read, Update, Delete (CRUD), pencarian, filter status, validasi form, dan edge case tiap operasi |
| Lingkungan | Local development dengan frontend Vue.js, backend Express.js, dan database MySQL |
| Data uji | Data fakultas dummy yang dibuat selama sesi pengujian, misalnya nama fakultas, kode unik 3 digit, dan status aktif/nonaktif |

### C. Pengujian Otomatis

Pengujian dilaksanakan secara otomatis dengan menjalankan script yang mengeksekusi setiap skenario pengujian secara berurutan. Script pengujian mencakup simulasi interaksi pengguna terhadap fitur CRUD halaman Fakultas. Setiap hasil pengujian dicatat berdasarkan respons yang diterima dari frontend maupun backend.

### D. Kasus dan Hasil Pengujian

#### 1. Read

| Case | Status |
| --- | --- |
| Data fakultas tampil dalam bentuk tabel | Pass |
| Kolom Nama Fakultas, Kode Unik, Status, dan Aksi tampil sesuai | Pass |
| KPI Total Fakultas tampil sesuai jumlah data | Pass |
| KPI Aktif tampil sesuai jumlah fakultas aktif | Pass |
| KPI Nonaktif tampil sesuai jumlah fakultas nonaktif | Pass |
| Pencarian berdasarkan nama fakultas berfungsi | Pass |
| Pencarian berdasarkan kode unik berfungsi | Pass |
| Filter status Semua status berfungsi | Pass |
| Filter status Aktif berfungsi | Pass |
| Filter status Nonaktif berfungsi | Pass |
| Label "Menampilkan X dari Y data" tampil sesuai hasil filter | Pass |
| Data kosong menampilkan pesan "Belum ada data fakultas" | Pass |
| Badge status Aktif/Nonaktif tampil sesuai nilai data | Pass |
| Loading state skeleton tampil saat data sedang dimuat | Pass |

#### 2. Create

| Case | Status |
| --- | --- |
| Tombol "Tambah Fakultas" membuka modal form | Pass |
| Field Nama Fakultas wajib diisi | Pass |
| Field Kode Unik wajib diisi di form | Pass |
| Field Kode Unik membatasi input maksimal 3 karakter | Pass |
| Checkbox Status Aktif dapat dicentang/dimatikan | Pass |
| Submit tanpa nama fakultas menampilkan error dari server | Pass |
| Submit dengan data valid berhasil membuat fakultas baru | Pass |
| Setelah submit berhasil, modal tertutup dan data ter-refresh | Pass |
| Klik Batal menutup modal tanpa menyimpan data | Pass |
| Klik di luar modal menutup modal tanpa menyimpan data | Pass |
| Duplikasi nama fakultas/kode unik ditangani sebagai error backend/database | Pass |

#### 3. Update

| Case | Status |
| --- | --- |
| Tombol Edit membuka modal dengan data pre-filled | Pass |
| Update nama fakultas berhasil tersimpan | Pass |
| Update kode unik berhasil tersimpan | Pass |
| Update status Aktif menjadi Nonaktif berhasil tersimpan | Pass |
| Update status Nonaktif menjadi Aktif berhasil tersimpan | Pass |
| Setelah update berhasil, modal tertutup dan data ter-refresh | Pass |
| Submit update pada ID yang tidak ditemukan menampilkan error dari server | Pass |
| Error backend saat update ditampilkan dalam dialog SweetAlert | Pass |
| Klik Batal saat edit menutup modal tanpa menyimpan perubahan | Pass |

#### 4. Delete

| Case | Status |
| --- | --- |
| Tombol Hapus/Trash menampilkan konfirmasi SweetAlert | Pass |
| Klik Batal pada dialog konfirmasi tidak menjalankan aksi delete | Pass |
| Konfirmasi delete berhasil menghapus data fakultas | Pass |
| Setelah delete berhasil, data tabel ter-refresh | Pass |
| Delete pada ID yang tidak ditemukan menampilkan error dari server | Pass |
| Error backend saat delete ditampilkan dalam dialog SweetAlert | Pass |

### E. Kesimpulan

Berdasarkan hasil pengujian, fitur halaman Fakultas Admin telah memenuhi kebutuhan utama CRUD dan filter data. Fitur dapat menampilkan daftar fakultas, menambahkan data baru, memperbarui data existing, menghapus data, serta menangani error dasar dari backend. Data fakultas yang dikelola pada halaman ini konsisten dengan endpoint backend `/faculties` dan dapat digunakan sebagai referensi pada fitur donasi/iuran.
