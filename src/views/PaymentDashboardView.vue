<template>
  <div :class="isEmbed ? '' : 'min-h-screen'">
    <Breadcrumb v-if="!isEmbed" breadcrumb="dashboard-pembayaran" />

    <div :class="isEmbed ? 'mt-0 space-y-5' : 'mt-8 space-y-5'">
      <section v-if="!isEmbed" class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold md:text-4xl">Dashboard Pembayaran</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Pantau pembayaran iuran sukarela dan kontribusi sukarela berdasarkan status, metode, fakultas, dan tren harian.
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-50">
            <p class="text-sm font-medium text-blue-100">Periode</p>
            <p class="mt-1 font-semibold">{{ filtersLabel }}</p>
          </div>
        </div>
      </section>

      <div
        v-if="!midtransEnabled"
        class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        Pembayaran online (Midtrans) sedang <span class="font-semibold">dinonaktifkan sementara</span>.
        Dashboard ini memantau pembayaran iuran &amp; kontribusi sukarela, sehingga tidak akan ada
        transaksi baru di sini sampai pembayaran online diaktifkan kembali. Donasi manual ada di menu
        <span class="font-semibold">Donasi</span>.
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Mulai</label>
            <input
              v-model="startDate"
              type="date"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Sampai</label>
            <input
              v-model="endDate"
              type="date"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Jenis</label>
            <AppSelect
              v-model="donationType"
              :options="donationTypeOptions"
            />
          </div>
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Status</label>
            <AppSelect
              v-model="paymentStatus"
              :options="paymentStatusOptions"
            />
          </div>
          <div class="flex items-end">
            <button
              type="button"
              :disabled="isLoading"
              class="w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              @click="getData"
            >
              {{ isLoading ? 'Memuat...' : 'Terapkan' }}
            </button>
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

      <div class="grid gap-5 xl:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-base font-bold text-slate-900">Status Pembayaran</h2>
          <div class="mt-4 space-y-3">
            <div v-for="item in statusSummary" :key="item.status">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium capitalize text-slate-700">{{ item.status }}</span>
                <span class="text-slate-500">{{ item.count }} transaksi</span>
              </div>
              <div class="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                <div class="h-full rounded-full" :class="statusBarClass(item.status)" :style="{ width: `${barWidth(item.count, maxStatusCount)}%` }"></div>
              </div>
              <p class="mt-1 text-xs text-slate-500">{{ formatIDR(item.totalAmount) }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-base font-bold text-slate-900">Jenis Pembayaran</h2>
          <div class="mt-4 space-y-4">
            <div v-for="item in typeSummary" :key="item.type" class="rounded-xl bg-slate-50 p-4">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="font-semibold text-slate-900">{{ formatDonationType(item.type) }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ item.count }} transaksi</p>
                </div>
                <p class="font-bold text-blue-800 sm:text-right">{{ formatIDR(item.totalAmount) }}</p>
              </div>
              <div class="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 sm:grid-cols-2">
                <span>Lunas: {{ formatIDR(item.settledAmount) }}</span>
                <span>Pending: {{ formatIDR(item.pendingAmount) }}</span>
              </div>
            </div>
            <p v-if="typeSummary.length === 0" class="py-8 text-center text-sm italic text-slate-400">Belum ada data pada periode ini.</p>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-base font-bold text-slate-900">Metode Pembayaran</h2>
          <div class="mt-4 space-y-4">
            <div v-for="item in methodSummary" :key="item.method">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium capitalize text-slate-700">{{ item.method }}</span>
                <span class="font-semibold text-slate-900">{{ formatIDR(item.totalAmount) }}</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div class="h-full rounded-full bg-blue-700" :style="{ width: `${barWidth(item.totalAmount, maxMethodAmount)}%` }"></div>
              </div>
              <p class="mt-1 text-xs text-slate-500">{{ item.count }} transaksi</p>
            </div>
            <p v-if="methodSummary.length === 0" class="py-8 text-center text-sm italic text-slate-400">Belum ada data metode pembayaran.</p>
          </div>
        </div>
      </div>

      <div class="grid gap-5 xl:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-base font-bold text-slate-900">Tren Harian</h2>
          <div class="mt-4 flex h-56 items-end gap-2 border-b border-slate-100 pb-2">
            <div
              v-for="item in dailyTrend"
              :key="item.date"
              class="group flex min-w-[22px] flex-1 flex-col items-center justify-end"
              :title="`${formatDate(item.date)} - ${formatIDR(item.totalAmount)}`"
            >
              <div
                class="w-full rounded-t bg-blue-700 transition-all group-hover:bg-blue-500"
                :style="{ height: `${barWidth(item.totalAmount, maxTrendAmount)}%`, minHeight: item.totalAmount ? '8px' : '2px' }"
              ></div>
            </div>
          </div>
          <div class="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>{{ dailyTrend[0]?.date ? formatShortDate(dailyTrend[0].date) : '-' }}</span>
            <span>{{ dailyTrend[dailyTrend.length - 1]?.date ? formatShortDate(dailyTrend[dailyTrend.length - 1].date) : '-' }}</span>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-base font-bold text-slate-900">Breakdown Fakultas</h2>
          <div class="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            <div v-for="item in facultySummary" :key="item.facultyId || item.facultyName" class="rounded-xl border border-slate-100 p-3">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div>
                  <p class="font-semibold text-slate-900">{{ item.facultyName }}</p>
                  <p class="text-xs text-slate-500">{{ item.count }} transaksi · kode {{ item.kodeUnik || '-' }}</p>
                </div>
                <p class="font-bold text-blue-800 sm:text-right">{{ formatIDR(item.totalAmount) }}</p>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div class="h-full rounded-full bg-emerald-500" :style="{ width: `${barWidth(item.totalAmount, maxFacultyAmount)}%` }"></div>
              </div>
            </div>
            <p v-if="facultySummary.length === 0" class="py-8 text-center text-sm italic text-slate-400">Belum ada data fakultas.</p>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 class="text-base font-bold text-slate-900">Pembayaran Terbaru</h2>
            <p class="mt-1 text-xs text-slate-500">10 transaksi terbaru sesuai filter dashboard.</p>
          </div>
          <router-link to="/donasi" class="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100">
            Lihat Donasi
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-4 py-3 text-left text-sm font-semibold text-blue-100">Tanggal</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-blue-100">Nama</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-blue-100">Jenis</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-blue-100">Fakultas</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-blue-100">Nominal</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-blue-100">Metode</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-blue-100">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="isLoading">
                <td v-for="c in 7" :key="c" class="px-4 py-4">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="recentPayments.length === 0">
                <td colspan="7" class="px-4 py-10 text-center text-sm italic text-slate-400">Belum ada pembayaran pada periode ini.</td>
              </tr>
              <template v-else>
                <tr v-for="item in recentPayments" :key="item.id" class="hover:bg-blue-50/40">
                  <td class="px-4 py-3 text-slate-600 whitespace-nowrap">{{ formatDate(item.paidAt || item.date || item.createdAt) }}</td>
                  <td class="px-4 py-3">
                    <p class="font-medium text-slate-900 whitespace-nowrap">{{ item.name || '-' }}</p>
                    <p class="text-xs text-slate-500 whitespace-nowrap">{{ item.email || '-' }}</p>
                  </td>
                  <td class="px-4 py-3 text-slate-700 whitespace-nowrap">{{ formatDonationType(item.donationType) }}</td>
                  <td class="px-4 py-3 text-slate-700 whitespace-nowrap">{{ item.facultyName || '-' }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-slate-900 whitespace-nowrap">{{ formatIDR(item.grossAmount || item.amount) }}</td>
                  <td class="px-4 py-3">
                    <span class="rounded-full px-2 py-0.5 text-xs font-medium capitalize" :class="methodBadgeClass(item.paymentMethod)">
                      {{ item.paymentMethod || '-' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="rounded-full px-2 py-0.5 text-xs font-medium capitalize" :class="statusBadgeClass(item.paymentStatus)">
                      {{ item.paymentStatus || 'pending' }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isMidtransEnabled } from '@/utils/midtrans';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Breadcrumb from '@/components/AppBreadcrumb.vue';
import AppSelect from '@/components/input/AppSelect.vue';
import { GET_PAYMENT_DASHBOARD } from '@/store/paymentDashboard.module';
import type {
  PaymentDashboardData,
  PaymentDashboardKpis,
  PaymentSummaryItem,
} from '@/types/domain';

withDefaults(defineProps<{ isEmbed?: boolean }>(), {
  isEmbed: false,
});

const store = useStore();
const isLoading = ref(true);
const donationType = ref('all');
const paymentStatus = ref('');
const donationTypeOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'iuran_sukarela', label: 'Iuran Sukarela' },
  { value: 'kontribusi_sukarela', label: 'Kontribusi Sukarela' },
];
const paymentStatusOptions = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'settlement', label: 'Lunas' },
  { value: 'expired', label: 'Kedaluwarsa' },
  { value: 'failed', label: 'Gagal' },
  { value: 'refunded', label: 'Dikembalikan' },
];

const today = new Date();
const start = new Date(today);
start.setDate(today.getDate() - 29);

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);
const startDate = ref(toDateInput(start));
const endDate = ref(toDateInput(today));

const midtransEnabled = isMidtransEnabled();
const dashboard = computed<PaymentDashboardData>(() => store.getters.paymentDashboard || {});
const kpis = computed<PaymentDashboardKpis>(() => dashboard.value.kpis || {});
const statusSummary = computed<PaymentSummaryItem[]>(() => dashboard.value.statusSummary || []);
const typeSummary = computed<PaymentSummaryItem[]>(() => dashboard.value.typeSummary || []);
const methodSummary = computed<PaymentSummaryItem[]>(() => dashboard.value.methodSummary || []);
const facultySummary = computed<PaymentSummaryItem[]>(() => dashboard.value.facultySummary || []);
const dailyTrend = computed<PaymentSummaryItem[]>(() => dashboard.value.dailyTrend || []);
const recentPayments = computed<PaymentSummaryItem[]>(() => dashboard.value.recentPayments || []);

const filtersLabel = computed(() => `${formatShortDate(startDate.value)} - ${formatShortDate(endDate.value)}`);

const maxStatusCount = computed(() => Math.max(...statusSummary.value.map((item) => Number(item.count || 0)), 1));
const maxMethodAmount = computed(() => Math.max(...methodSummary.value.map((item) => Number(item.totalAmount || 0)), 1));
const maxFacultyAmount = computed(() => Math.max(...facultySummary.value.map((item) => Number(item.totalAmount || 0)), 1));
const maxTrendAmount = computed(() => Math.max(...dailyTrend.value.map((item) => Number(item.totalAmount || 0)), 1));

const kpiCards = computed(() => [
  {
    title: 'Total Masuk',
    value: formatIDR(kpis.value.totalAmount),
    description: `${kpis.value.totalCount || 0} transaksi`,
  },
  {
    title: 'Sudah Lunas',
    value: formatIDR(kpis.value.settledAmount),
    description: `${kpis.value.settledCount || 0} transaksi settlement`,
  },
  {
    title: 'Menunggu',
    value: formatIDR(kpis.value.pendingAmount),
    description: `${kpis.value.pendingCount || 0} transaksi pending`,
  },
  {
    title: 'Gagal/Expired',
    value: `${(kpis.value.failedCount || 0) + (kpis.value.expiredCount || 0)}`,
    description: `Failed ${kpis.value.failedCount || 0} · Expired ${kpis.value.expiredCount || 0}`,
  },
  {
    title: 'Rasio Lunas',
    value: `${kpis.value.settlementRate || 0}%`,
    description: 'Dari total transaksi periode ini',
  },
]);

const getData = async () => {
  isLoading.value = true;
  try {
    await store.dispatch(GET_PAYMENT_DASHBOARD, {
      data: {
        startDate: startDate.value,
        endDate: endDate.value,
        donationType: donationType.value,
        paymentStatus: paymentStatus.value || undefined,
      },
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(getData);

const formatIDR = (amount?: number | string | null) => {
  const value = Number(amount || 0);
  return `Rp ${value.toLocaleString('id-ID')}`;
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatShortDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
};

const formatDonationType = (type?: string) => {
  if (!type) return '-';
  return type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const barWidth = (value: number | string, max: number) => {
  const numericValue = Number(value || 0);
  if (!numericValue || !max) return 0;
  return Math.max(4, Math.round((numericValue / max) * 100));
};

const statusBarClass = (status?: string) => {
  if (status === 'settlement') return 'bg-green-500';
  if (status === 'pending') return 'bg-yellow-500';
  if (status === 'failed') return 'bg-red-500';
  if (status === 'expired') return 'bg-slate-400';
  return 'bg-purple-500';
};

const statusBadgeClass = (status?: string) => {
  if (status === 'settlement') return 'bg-green-100 text-green-700';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
  if (status === 'failed') return 'bg-red-100 text-red-700';
  if (status === 'expired') return 'bg-slate-200 text-slate-700';
  if (status === 'refunded') return 'bg-purple-100 text-purple-700';
  return 'bg-slate-100 text-slate-600';
};

const methodBadgeClass = (method?: string) =>
  method === 'midtrans' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700';
</script>
