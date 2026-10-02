<template>
  <div class="space-y-4">
    <div class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Konfirmasi transfer yang dikirim donatur lewat form donasi di website. Data ini
      <span class="font-semibold">belum diverifikasi</span> — cocokkan dengan mutasi rekening,
      lalu catat di tab <span class="font-semibold">Catatan Donasi</span>.
    </div>

    <section class="flex flex-wrap items-center gap-3">
      <AppSelect v-model="limit" :options="limitOptions" class="w-24" @change="reload" />
      <div class="relative">
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          v-model="search"
          placeholder="Cari nama, email, nomor..."
          class="w-60 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          @input="onSearchInput"
        />
      </div>
      <AppSelect v-model="sortOrder" :options="sortOptions" class="w-32" @change="reload" />
    </section>

    <div v-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      Gagal memuat konfirmasi transfer: {{ error }}
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-blue-900">
              <th class="px-4 py-3.5 text-left text-sm font-semibold text-blue-100">No</th>
              <th class="px-4 py-3.5 text-left text-sm font-semibold text-blue-100">Dikirim</th>
              <th class="px-4 py-3.5 text-left text-sm font-semibold text-blue-100">Donatur</th>
              <th class="px-4 py-3.5 text-left text-sm font-semibold text-blue-100">Jenis Kontribusi</th>
              <th class="px-4 py-3.5 text-left text-sm font-semibold text-blue-100">Fakultas / Sekolah</th>
              <th class="px-4 py-3.5 text-right text-sm font-semibold text-blue-100">Nominal</th>
              <th class="px-4 py-3.5 text-left text-sm font-semibold text-blue-100">Bukti Bayar</th>
              <th class="px-4 py-3.5 text-left text-sm font-semibold text-blue-100">Tanda Terima</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <template v-if="loading">
              <tr v-for="i in Math.min(limit, 5)" :key="i">
                <td v-for="c in 8" :key="c" class="px-4 py-4">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
            </template>
            <tr v-else-if="!rows.length">
              <td colspan="8" class="px-4 py-12 text-center text-sm italic text-slate-400">
                Belum ada konfirmasi transfer.
              </td>
            </tr>
            <tr v-for="(row, idx) in rows" v-else :key="row.id" class="align-top transition-colors hover:bg-blue-50/40">
              <td class="px-4 py-3 text-slate-500">{{ pagination.start + idx }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-slate-700">{{ formatDateTime(row.submittedAt) }}</td>
              <td class="px-4 py-3">
                <p class="font-medium text-slate-900">{{ answer(row, /^nama$/) || '-' }}</p>
                <p v-if="row.extractedWhatsapp || answer(row, /(no|nomor) (hp|wa)|whatsapp/)" class="text-xs text-slate-500">
                  {{ row.extractedWhatsapp || answer(row, /(no|nomor) (hp|wa)|whatsapp/) }}
                </p>
                <p v-if="answer(row, /^e ?mail$/)" class="text-xs text-slate-500">{{ answer(row, /^e ?mail$/) }}</p>
              </td>
              <td class="px-4 py-3 text-slate-700">{{ answer(row, /jenis kontribusi/) || '-' }}</td>
              <td class="px-4 py-3 text-slate-700">{{ answer(row, /fakultas|sekolah/) || '-' }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-900">{{ formatNominal(answer(row, /nominal/)) }}</td>
              <td class="px-4 py-3">
                <div v-if="proofUrls(row).length" class="flex flex-col gap-1">
                  <a
                    v-for="(url, i) in proofUrls(row)"
                    :key="url"
                    :href="url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                  >
                    Lihat{{ proofUrls(row).length > 1 ? ` ${i + 1}` : '' }}
                    <svg class="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <span v-else class="text-slate-400">—</span>
              </td>
              <td class="px-4 py-3">
                <span
                  v-if="wantsReceipt(row)"
                  class="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                  :title="answer(row, /tanda terima/) || ''"
                >
                  Minta via WA
                </span>
                <span v-else class="text-slate-400">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col items-center justify-between gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row">
        <span class="text-xs text-slate-500">
          Menampilkan {{ pagination.start || 0 }}–{{ pagination.end || 0 }} dari {{ pagination.totalEntries || 0 }} entri
        </span>
        <div class="inline-flex">
          <button
            class="rounded-l-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="pagination.currentPage <= 1"
            @click="goTo(pagination.currentPage - 1)"
          >Sebelumnya</button>
          <button
            class="rounded-r-lg border-y border-r border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="pagination.currentPage >= pagination.totalPages"
            @click="goTo(pagination.currentPage + 1)"
          >Berikutnya</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import AppSelect from '@/components/input/AppSelect.vue'
import { GET_DONASI_TALLY, type DonasiTallySubmission } from '@/store/donasiTally.module'

const store = useStore()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const sortOrder = ref('DESC')

const limitOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]
const sortOptions = [
  { value: 'DESC', label: 'Terbaru' },
  { value: 'ASC', label: 'Terlama' },
]

const rows = computed<DonasiTallySubmission[]>(() => store.getters['donasiTally/list'] ?? [])
const pagination = computed(() => store.getters['donasiTally/pagination'])
const loading = computed<boolean>(() => store.getters['donasiTally/loading'])
const error = computed<string | null>(() => store.getters['donasiTally/error'])

const normalizeLabel = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

// Label pertanyaan di form Tally bisa berubah ejaan/kapitalisasi dan ada yang
// kembar ("Upload Bukti Bayar" ×3, "Tanda Terima" ×3), jadi kolom dicari
// berdasarkan pola label, bukan nama persis.
const answersMatching = (row: DonasiTallySubmission, pattern: RegExp) =>
  Object.entries(row.payload?.answersByLabel ?? {})
    .filter(([label, value]) => pattern.test(normalizeLabel(label)) && value != null && String(value).trim() !== '')
    .map(([, value]) => String(value).trim())

const answer = (row: DonasiTallySubmission, pattern: RegExp) => answersMatching(row, pattern)[0] ?? ''

const proofUrls = (row: DonasiTallySubmission) =>
  answersMatching(row, /bukti bayar|bukti transfer/)
    .flatMap((value) => value.split(/,\s*(?=https?:\/\/)/))
    .filter((value) => /^https?:\/\//.test(value))

const wantsReceipt = (row: DonasiTallySubmission) => /whatsapp|wa\b/i.test(answer(row, /tanda terima/))

const formatDateTime = (iso?: string) => {
  if (!iso) return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// Nominal diketik bebas oleh donatur ("100.000", "Rp 50rb", ...): tampilkan
// sebagai Rupiah hanya bila jelas angka, selain itu apa adanya.
const formatNominal = (raw: string) => {
  if (!raw) return '-'
  // "100000", "100.000", "Rp 100.000", "Rp100.000,00" → angka; "50rb", "seikhlasnya" → apa adanya.
  const match = raw.trim().match(/^(?:rp\.?\s*)?(\d[\d.\s]*)(?:,\d{1,2})?$/i)
  if (!match) return raw
  return `Rp ${Number(match[1].replace(/\D/g, '')).toLocaleString('id-ID')}`
}

const getData = () =>
  store.dispatch(`donasiTally/${GET_DONASI_TALLY}`, {
    search: search.value || undefined,
    limit: limit.value,
    page: page.value,
    sortOrder: sortOrder.value,
  })

const reload = () => {
  page.value = 1
  getData()
}

const goTo = (target: number) => {
  page.value = target
  getData()
}

let searchTimer: ReturnType<typeof setTimeout> | null = null
const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(reload, 400)
}

onMounted(getData)
</script>
