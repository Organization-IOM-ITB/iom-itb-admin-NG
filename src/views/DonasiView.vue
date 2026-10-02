<template>
  <div class="min-h-screen">
    <Breadcrumb :breadcrumb="title" />

    <ModalForm
      v-if="isOpened"
      :id="currentId"
      :title="`${currentId ? 'Edit' : 'Tambah'} ${title}`"
      :data="dataUpdate"
      @close="handleModalClose"
    />

    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
      @click="closeImageModal"
    >
      <img :src="selectedImage" alt="Bukti bayar manual" class="max-w-full max-h-full rounded-md shadow-lg" />
    </div>

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold md:text-4xl">{{ title }}</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">{{ midtransEnabled ? 'Donasi manual dan online Midtrans tercatat dalam satu daftar.' : 'Donasi manual tercatat dalam satu daftar. Pembayaran online (Midtrans) sedang dinonaktifkan.' }}</p>
          </div>
          <div class="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <button
              type="button"
              class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl sm:w-auto"
              @click="openAddModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
              </svg>
              Tambah Donasi
            </button>
            <a
              :href="excelUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-px hover:bg-emerald-400 hover:shadow-xl sm:w-auto"
            >
              Excel
              <IcLink class="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <div class="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.value"
          class="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          :class="activeTab === tab.value ? 'bg-[#003793] text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <DonasiTallySection v-if="activeTab === 'konfirmasi'" />

      <template v-else>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Per halaman</label>
            <AppSelect
              v-model="limit"
              :options="pageLimitOptions"
              @change="() => { page = 1; getData() }"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Metode</label>
            <AppSelect
              v-model="paymentMethod"
              :options="paymentMethodOptions"
              @change="() => { page = 1; getData() }"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Status</label>
            <AppSelect
              v-model="paymentStatus"
              :options="paymentStatusOptions"
              @change="() => { page = 1; getData() }"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Jenis Donasi</label>
            <AppSelect
              v-model="donationType"
              :options="donationTypeFilterOptions"
              @change="() => { page = 1; getData() }"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Cari Nama</label>
            <input
              v-model="search"
              @input="onSearchInput"
              placeholder="Ketik nama..."
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div v-for="card in kpiCards" :key="card.title" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">{{ card.title }}</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ card.value }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ card.description }}</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 class="text-base font-bold text-slate-900">Daftar Donasi</h2>
            <p class="mt-1 text-xs text-slate-500">Transaksi donasi sesuai filter daftar.</p>
          </div>
          <span class="text-xs text-slate-500">Halaman {{ pagination?.currentPage || page }} dari {{ pagination?.totalPages || 1 }}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">No</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Tanggal</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Donatur</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Jenis</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Fakultas</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Kode</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-right text-blue-100">Nominal</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Metode</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Status</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Bukti Manual</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-right text-blue-100">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td v-for="c in 11" :key="c" class="px-4 py-4">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="computedData.length === 0">
                <td colspan="11" class="px-4 py-12 text-sm text-center text-slate-400 italic">Belum ada donasi.</td>
              </tr>
              <tr
                v-else
                v-for="(u, index) in computedData"
                :key="u.id"
                class="transition-colors hover:bg-blue-50/40"
              >
                <td class="px-4 py-3 text-gray-500 align-middle">{{ startNumber + index }}</td>
                <td class="px-4 py-3 text-gray-700 align-middle whitespace-nowrap">
                  {{ formatDate(u.date || u.createdAt) }}
                  <span
                    v-if="!u.date"
                    class="block text-[11px] italic text-gray-400"
                    title="Tanggal donasi tidak dicatat; yang tampil adalah tanggal data diinput"
                  >tgl. input</span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <p class="font-medium text-gray-900 whitespace-nowrap">{{ u.name || '-' }}</p>
                  <p v-if="isRecordedContact(u.email)" class="text-xs text-gray-500 whitespace-nowrap">{{ u.email }}</p>
                  <p v-if="isRecordedContact(u.noWhatsapp)" class="text-xs text-gray-500 whitespace-nowrap">{{ u.noWhatsapp }}</p>
                  <p
                    v-if="!isRecordedContact(u.email) && !isRecordedContact(u.noWhatsapp)"
                    class="text-xs italic text-gray-400 whitespace-nowrap"
                    title="Kontak donatur tidak dicatat (placeholder dari data lama)"
                  >— kontak tidak dicatat</p>
                </td>
                <td class="px-4 py-3 text-gray-700 align-middle">{{ formatDonationType(u.donationType) }}</td>
                <td class="px-4 py-3 text-gray-700 align-middle whitespace-nowrap">{{ u.faculty?.name || '-' }}</td>
                <td class="px-4 py-3 font-mono text-xs text-gray-600 align-middle">{{ u.kodeUnik || u.faculty?.kodeUnik || '-' }}</td>
                <td class="px-4 py-3 font-medium text-right text-gray-900 align-middle whitespace-nowrap">
                  <template v-if="hasRecordedAmount(u)">{{ formatNominal(u.grossAmount || u.amount) }}</template>
                  <span
                    v-else
                    class="text-xs font-normal italic text-gray-400"
                    title="Nominal tidak dicatat (kosong atau 0 pada data lama)"
                  >— tidak dicatat</span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <span :class="methodBadgeClass(u.paymentMethod)" class="inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize">
                    {{ u.paymentMethod === 'midtrans' ? 'Midtrans' : 'Manual' }}
                  </span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <span :class="statusBadgeClass(u.paymentStatus)" class="inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize">
                    {{ paymentStatusLabel(u.paymentStatus) }}
                  </span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <span
                    v-if="u.paymentMethod === 'midtrans'"
                    class="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700"
                  >
                    Midtrans
                  </span>
                  <button
                    v-else-if="u.proof"
                    class="text-sm font-medium text-indigo-600 hover:underline"
                    @click="openImageModal(u.proof)"
                  >Lihat</button>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-4 py-3 text-right align-middle">
                  <button
                    type="button"
                    class="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                    @click.prevent="editItem(u)"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col items-center justify-between gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row">
          <span class="text-xs text-slate-500">
            Menampilkan {{ pagination?.start || 0 }}–{{ pagination?.end || 0 }} dari {{ pagination?.totalEntries || 0 }} entri
          </span>
          <div class="inline-flex">
            <button
              class="rounded-l-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page <= 1"
              @click="() => { page = (pagination?.currentPage || 1) - 1; getData(); }"
            >Sebelumnya</button>
            <button
              class="rounded-r-lg border-y border-r border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page >= (pagination?.totalPages || 1)"
              @click="() => { page = (pagination?.currentPage || 1) + 1; getData(); }"
            >Berikutnya</button>
          </div>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { paymentStatusLabel } from '@/utils/statusLabels';
import { isMidtransEnabled } from '@/utils/midtrans';
import { ref, computed, onMounted } from 'vue';
import { GET_DONASI } from '@/store/donasi.module';
import ModalForm from '@/components/modal/FormDonation.vue';
import IcLink from '@/assets/svg/ic-link.vue';
import IcEdit from '@/assets/svg/ic-edit.vue';
import Swal from 'sweetalert2';
import { useStore } from 'vuex';
import { formatDate } from '@/utils';
import Breadcrumb from '@/components/AppBreadcrumb.vue';
import AppSelect from '@/components/input/AppSelect.vue';
import DonasiTallySection from '@/components/DonasiTallySection.vue';

interface DonationRow {
  id?: string | number;
  date?: string;
  createdAt?: string;
  name?: string;
  email?: string;
  noWhatsapp?: string;
  donationType?: string;
  faculty?: {
    name?: string;
    kodeUnik?: string;
  };
  kodeUnik?: string;
  grossAmount?: number | string | null;
  amount?: number | string | null;
  paymentMethod?: string;
  paymentStatus?: string;
  proof?: string;
}

const excelUrl =
  'https://docs.google.com/spreadsheets/d/13w3FcIz4jjIBcf7DvG_83FmU8NBss_MkGt4lM7U6x6k/edit?usp=sharing';

const store = useStore();

const isLoading = ref(true);
const page = ref(1);
const limit = ref(10);
const search = ref('');
const paymentMethod = ref('');
const paymentStatus = ref('');
const donationType = ref('');
const isImageModalOpen = ref(false);
const selectedImage = ref('');
const title = ref('Donasi');
const midtransEnabled = isMidtransEnabled();

// Selama pembayaran otomatis nonaktif, donasi baru datang lewat form Tally —
// jadi tab konfirmasi transfer yang dibuka lebih dulu.
const tabs = [
  { value: 'konfirmasi', label: 'Konfirmasi Transfer (Form)' },
  { value: 'catatan', label: 'Catatan Donasi' },
] as const;
const activeTab = ref<'konfirmasi' | 'catatan'>('konfirmasi');

const isOpened = ref(false);
const currentId = ref<string | undefined>(undefined);
const dataUpdate = ref<Partial<DonationRow>>({});
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const pageLimitOptions = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];
const paymentMethodOptions = [
  { value: '', label: 'Semua' },
  { value: 'manual', label: 'Manual' },
  ...(isMidtransEnabled() ? [{ value: 'midtrans', label: 'Midtrans' }] : []),
];
const paymentStatusOptions = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'settlement', label: 'Lunas' },
  { value: 'expired', label: 'Kedaluwarsa' },
  { value: 'failed', label: 'Gagal' },
  { value: 'refunded', label: 'Dikembalikan' },
];
const donationTypeFilterOptions = [
  { value: '', label: 'Semua' },
  { value: 'iuran_sukarela', label: 'Iuran Sukarela' },
  { value: 'kontribusi_anggota', label: 'Kontribusi Anggota' },
  { value: 'kontribusi_donatur', label: 'Kontribusi Donatur' },
  { value: 'pembelian_merchandise', label: 'Pembelian Merchandise' },
  { value: 'kontribusi_sukarela', label: 'Kontribusi Sukarela' },
];

const openAddModal = () => {
  currentId.value = undefined;
  dataUpdate.value = {};
  isOpened.value = true;
};

const editItem = (item: DonationRow) => {
  dataUpdate.value = { ...item };
  currentId.value = String(item.id);
  isOpened.value = true;
};

const handleModalClose = async () => {
  isOpened.value = false;
  currentId.value = undefined;
  dataUpdate.value = {};
  await getData();
};

const computedData = computed<DonationRow[]>(() => {
  const donasi = store.getters.donasi;
  return donasi?.data || [];
});

const pagination = computed(() => {
  const donasi = store.getters.donasi;
  return donasi?.pagination || {};
});

const startNumber = computed(() => pagination.value?.start || 1);
const settlementCount = computed(() =>
  computedData.value.filter((item) => item?.paymentStatus === 'settlement').length
);
const pendingCount = computed(() =>
  computedData.value.filter((item) => item?.paymentStatus === 'pending').length
);
const manualCount = computed(() =>
  computedData.value.filter((item) => item?.paymentMethod !== 'midtrans').length
);
const displayedAmountTotal = computed(() =>
  computedData.value.reduce((total, item) => {
    const amount = Number(item?.grossAmount || item?.amount || 0);
    return Number.isNaN(amount) ? total : total + amount;
  }, 0)
);

const kpiCards = computed(() => [
  {
    title: 'Total Data',
    value: String(pagination.value?.totalEntries || computedData.value.length),
    description: `${computedData.value.length} donasi ditampilkan`,
  },
  {
    title: 'Sudah Lunas',
    value: String(settlementCount.value),
    description: 'Transaksi settlement di halaman ini',
  },
  {
    title: 'Menunggu',
    value: String(pendingCount.value),
    description: 'Transaksi pending di halaman ini',
  },
  {
    title: 'Manual',
    value: String(manualCount.value),
    description: 'Input manual di halaman ini',
  },
  {
    title: 'Nominal Halaman',
    value: formatNominal(displayedAmountTotal.value),
    description: 'Akumulasi nominal yang sedang tampil',
  },
]);

// Donasi lama (v1) diisi admin dengan placeholder bila kontak tidak diketahui:
// 394 dari 633 email dan 597 WA bernilai "000". Nilai yang hanya berisi
// 0, "-", ".", "_" atau spasi dianggap tidak dicatat; datanya tidak diubah.
const isRecordedContact = (value?: string | null) =>
  Boolean(value) && !/^[\s0._-]*$/.test(String(value));

// 20 donasi lama (v1) tidak punya nominal: 9 kosong, 11 bernilai 0 (default
// kolom v1). Ditandai, bukan ditampilkan "Rp 0" yang terbaca seperti nyata.
const hasRecordedAmount = (item: DonationRow) => Number(item.grossAmount || item.amount || 0) > 0;

const formatDonationType = (t?: string) => {
  if (!t) return '-';
  return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatNominal = (amount?: number | string | null) => {
  if (amount == null || amount === '') return '-';
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return `Rp ${n.toLocaleString('id-ID')}`;
};

const methodBadgeClass = (method?: string) =>
  method === 'midtrans' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700';

const statusBadgeClass = (status?: string) => {
  switch (status) {
    case 'settlement':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'expired':
      return 'bg-slate-200 text-slate-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    case 'refunded':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

const getData = async () => {
  isLoading.value = true;
  try {
    await store.dispatch(GET_DONASI, {
      data: {
        search: search.value,
        limit: limit.value,
        page: page.value,
        paymentMethod: paymentMethod.value || undefined,
        paymentStatus: paymentStatus.value || undefined,
        donationType: donationType.value || undefined,
      },
    });
  } finally {
    isLoading.value = false;
  }
};

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    getData();
  }, 350);
};

onMounted(getData);

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  isImageModalOpen.value = true;
};
const closeImageModal = () => {
  isImageModalOpen.value = false;
};
</script>
