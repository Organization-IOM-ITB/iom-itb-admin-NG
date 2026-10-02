<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" class="w-full max-w-[760px]" @click.stop>
      <form @submit.prevent="handleSubmit" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 class="text-lg font-bold capitalize text-slate-900">{{ title }}</h3>
            <p class="mt-1 text-sm text-slate-500">Catat donasi manual, nominal, kanal notifikasi, dan bukti transfer jika ada.</p>
          </div>
          <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeModal">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="max-h-[75vh] overflow-y-auto bg-white">
          <div class="divide-y divide-slate-100">
            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Nama <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Nama donatur yang dicatat.</p>
              </div>
              <input
                v-model="formData.data.name"
                required
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. Budi Santoso"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Email</label>
                <p class="mt-0.5 text-xs text-slate-400">Salah satu dari email atau No WA wajib diisi.</p>
              </div>
              <input
                v-model="formData.data.email"
                type="email"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="nama@email.com"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">No WA</label>
                <p class="mt-0.5 text-xs text-slate-400">Nomor WhatsApp untuk notifikasi donasi.</p>
              </div>
              <input
                v-model="formData.data.noWhatsapp"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="08123456789"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Jenis Donasi</label>
                <p class="mt-0.5 text-xs text-slate-400">Kategori pencatatan donasi.</p>
              </div>
              <AppSelect
                v-model="formData.data.donationType"
                :options="donationTypeSelectOptions"
                button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Fakultas <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Opsional, untuk kode unik fakultas.</p>
              </div>
              <div>
                <AppSelect
                  v-model="facultyId"
                  :options="facultyOptions"
                  button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
                />
                <p v-if="selectedFaculty" class="mt-1 text-xs text-slate-500">
                  Nominal akhir akan ditambah kode unik <b>{{ selectedFaculty.kodeUnik }}</b>.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Nominal <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Jumlah uang yang didonasikan.</p>
              </div>
              <input
                :value="formattedAmount"
                required
                type="text"
                inputmode="numeric"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Rp 0"
                @input="onAmountInput"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Tanggal Masuk <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Tanggal uang masuk.</p>
              </div>
              <input
                v-model="formData.data.date"
                required
                type="date"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Bank</label>
                <p class="mt-0.5 text-xs text-slate-400">Bank atau sumber transfer.</p>
              </div>
              <input
                v-model="formData.data.bank"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. BCA"
              />
            </div>

<div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Bank</label>
                <p class="mt-0.5 text-xs text-slate-400">Bank atau sumber transfer.</p>
              </div>
              <input
                v-model="formData.data.bank"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. BCA"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Metode Pembayaran</label>
                <p class="mt-0.5 text-xs text-slate-400">Kanal atau sumber bayar.</p>
              </div>
              <AppSelect
                v-model="formData.data.paymentMethod"
                :options="paymentMethodOptions"
                button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Status Pembayaran</label>
                <p class="mt-0.5 text-xs text-slate-400">Status transaksi.</p>
              </div>
              <AppSelect
                v-model="formData.data.paymentStatus"
                :options="paymentStatusOptions"
                button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-start">
              <div class="md:pt-2">
                <label class="text-sm font-semibold text-slate-900">Notifikasi <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Pilih kanal pengiriman notifikasi.</p>
              </div>
              <div>
                <input class="sr-only" :value="notificationValue" required tabindex="-1" />
                <div class="flex flex-wrap gap-2">
                  <label
                    v-for="option in notificationOptions"
                    :key="option.value"
                    class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    <input
                      v-model="formData.data.notification"
                      type="checkbox"
                      :value="option.value"
                      class="rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                    />
                    {{ option.label }}
                  </label>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-900">Publikasi Nama</label>
                <p class="mt-0.5 text-xs text-slate-400">Pengaturan tampilan nama donatur.</p>
              </div>
              <div class="grid gap-2 sm:grid-cols-2">
                <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  <input
                    v-model="formData.data.nameIsHidden"
                    type="checkbox"
                    class="rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                  />
                  Sembunyikan nama
                </label>
                <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  <input
                    v-model="formData.data.isHambaAllah"
                    type="checkbox"
                    class="rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                  />
                  Hamba Allah
                </label>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-start">
              <div class="md:pt-2">
                <label class="text-sm font-semibold text-slate-900">Bukti Transfer Manual</label>
                <p class="mt-0.5 text-xs text-slate-400">Opsional untuk donasi manual. Midtrans memakai status transaksi.</p>
              </div>
              <div class="space-y-3">
                <div class="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    class="rounded-md px-3 py-1.5 text-xs font-semibold transition"
                    :class="imageMode === 'url' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                    @click="setImageMode('url')"
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    class="rounded-md px-3 py-1.5 text-xs font-semibold transition"
                    :class="imageMode === 'upload' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                    @click="setImageMode('upload')"
                  >
                    Upload
                  </button>
                </div>

                <input
                  v-if="imageMode === 'url'"
                  v-model="imageUrlInput"
                  type="text"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://..."
                  @input="onImageUrlInput"
                />
                <input
                  v-else
                  type="file"
                  accept="image/*"
                  class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  @change="onImageChange"
                />

                <div v-if="imagePreview" class="flex items-start gap-3">
                  <img :src="imagePreview" alt="Preview bukti bayar" class="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
                  <button type="button" class="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100" @click="removeImage">
                    Hapus gambar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Batal
          </button>
          <button type="submit" :disabled="isLoading" class="rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { isMidtransEnabled } from '@/utils/midtrans';
import { defineComponent, ref, computed, onMounted, watch, reactive } from 'vue';
import { useStore } from 'vuex';
import { POST_DONASI, PUT_DONASI } from '@/store/donasi.module';
import { POST_IMAGE } from '@/store/upload.module';
import { GET_FAKULTAS } from '@/store/fakultas.module';
import type { Fakultas } from '@/store/fakultas.module';
import { showError } from '@/utils/swal';
import AppSelect from '@/components/input/AppSelect.vue';
import type { ApiErrorResponse, Donation, DonationPayload } from '@/types/domain';

const DONATION_TYPE_OPTIONS = [
  'iuran_sukarela',
  'kontribusi_anggota',
  'kontribusi_donatur',
  'pembelian_merchandise',
  'kontribusi_sukarela',
];

const formatDonationType = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const toInputDate = (value: unknown) => {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default defineComponent({
  components: {
    AppSelect,
  },
  props: {
    title: { type: String, required: true },
    id: { type: String, required: false },
    data: { type: Object, required: false, default: () => ({}) },
  },
  setup(props, { emit }) {
    const store = useStore();
    const initialData = props.data as Partial<Donation>;
    const modalContent = ref(null);
    const isLoading = ref(false);
    const facultyId = ref<number | null>(initialData.facultyId ?? initialData.faculty?.id ?? null);
    const imageMode = ref(initialData.proof ? 'url' : 'upload');
    const imageFile = ref<File | null>(null);
    const imagePreviewLocal = ref('');
    const imageUrlInput = ref(typeof initialData.proof === 'string' ? initialData.proof : '');

    const donationTypeOptions = ref(
      DONATION_TYPE_OPTIONS.map((value) => ({
        value,
        label: formatDonationType(value),
      }))
    );
    const donationTypeSelectOptions = computed(() => [
      { value: '', label: 'Pilih jenis donasi' },
      ...donationTypeOptions.value,
    ]);
    const notificationOptions = [
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'email', label: 'Email' },
    ];

    const isEditMode = Boolean(props.id);
    // Midtrans tetap muncul saat mengedit donasi yang memang dibayar via
    // Midtrans, agar nilainya tidak berubah diam-diam saat disimpan.
    const paymentMethodOptions = [
      { value: 'manual', label: 'Manual' },
      ...(isMidtransEnabled() || (isEditMode && initialData?.paymentMethod === 'midtrans')
        ? [{ value: 'midtrans', label: 'Midtrans' }]
        : []),
    ];
    const paymentStatusOptions = [
      { value: 'pending', label: 'Menunggu' },
      { value: 'settlement', label: 'Lunas' },
      { value: 'expired', label: 'Kedaluwarsa' },
      { value: 'failed', label: 'Gagal' },
      { value: 'refunded', label: 'Dikembalikan' },
    ];

    const formData = reactive({
      id: '',
      data: {
        ...initialData,
        name: initialData.name || '',
        email: initialData.email || '',
        noWhatsapp: initialData.noWhatsapp || '',
        donationType: initialData.donationType || '',
        amount: initialData.amount ?? initialData.grossAmount ?? '',
        date: toInputDate(initialData.date),
        bank: initialData.bank || '',
        notification: Array.isArray(initialData.notification) ? initialData.notification : [],
        nameIsHidden: initialData.options?.nameIsHidden || initialData.nameIsHidden || false,
        isHambaAllah: initialData.options?.isHambaAllah || initialData.isHambaAllah || false,
        image: initialData.proof || '',
        paymentMethod: initialData.paymentMethod || 'manual',
        paymentStatus: initialData.paymentStatus || (isEditMode ? initialData.paymentStatus : 'settlement'),
      } as DonationPayload,
    });

    const fakultasList = computed<Fakultas[]>(() => store.getters.fakultas || []);
    const facultyOptions = computed(() => [
      { value: null, label: 'Tidak terkait fakultas' },
      ...fakultasList.value.map((f) => ({
        value: f.id,
        label: `${f.name} (kode unik: ${f.kodeUnik})`,
      })),
    ]);
    const selectedFaculty = computed<Fakultas | undefined>(() =>
      fakultasList.value.find((f) => f.id === facultyId.value)
    );

    const formattedAmount = computed(() => {
      const amount = Number(formData.data.amount || 0);
      if (!amount || Number.isNaN(amount)) return '';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    });

    const notificationValue = computed(() =>
      Array.isArray(formData.data.notification) ? formData.data.notification.join(',') : ''
    );

    const imagePreview = computed(() => {
      if (imagePreviewLocal.value) return imagePreviewLocal.value;
      return imageUrlInput.value || '';
    });

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const onAmountInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const rawValue = input.value.replace(/\D/g, '');
      formData.data.amount = rawValue ? Number(rawValue) : '';
      input.value = formattedAmount.value;
    };

    const setImageMode = (mode: 'url' | 'upload') => {
      imageMode.value = mode;
      if (mode === 'url') {
        imageFile.value = null;
        imagePreviewLocal.value = '';
        formData.data.image = imageUrlInput.value;
      }
    };

    const onImageUrlInput = () => {
      imageFile.value = null;
      imagePreviewLocal.value = '';
      formData.data.image = imageUrlInput.value;
    };

    const onImageChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] || null;
      imageFile.value = file;
      if (!file) {
        imagePreviewLocal.value = '';
        formData.data.image = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        imagePreviewLocal.value = (reader.result as string) || '';
      };
      reader.readAsDataURL(file);
      formData.data.image = file;
    };

    const removeImage = () => {
      imageFile.value = null;
      imagePreviewLocal.value = '';
      imageUrlInput.value = '';
      formData.data.image = '';
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        const payload: DonationPayload = {
          ...formData.data,
          facultyId: facultyId.value,
        };

        if (payload.image) {
          if (typeof payload.image !== 'string') {
            const response = await store.dispatch(POST_IMAGE, { data: payload.image });
            payload.proof = response || '';
          } else {
            payload.proof = payload.image;
          }
          delete payload.image;
        }

        if (props.id) {
          formData.id = props.id;
          await store.dispatch(PUT_DONASI, { id: formData.id, data: payload });
        } else {
          await store.dispatch(POST_DONASI, { data: payload });
        }
        closeModal();
      } catch (error: unknown) {
        const apiError = error as ApiErrorResponse;
        showError('Gagal', apiError?.response?.data?.message || apiError?.message || 'Gagal menyimpan donasi');
        isLoading.value = false;
      }
    };

    watch(
      () => props.data?.facultyId,
      (v) => {
        if (v != null) facultyId.value = v;
      }
    );

    onMounted(async () => {
      try {
        if (!fakultasList.value.length) await store.dispatch(GET_FAKULTAS);
      } catch (err) {
        showError('Gagal', err instanceof Error ? err.message : 'Gagal memuat daftar fakultas');
      }
    });

return {
      modalContent,
      closeModal,
      handleSubmit,
      isLoading,
      donationTypeOptions,
      donationTypeSelectOptions,
      notificationOptions,
      fakultasList,
      facultyOptions,
      facultyId,
      selectedFaculty,
      formData,
      formattedAmount,
      notificationValue,
      imageMode,
      imageUrlInput,
      imagePreview,
      setImageMode,
      onAmountInput,
      onImageUrlInput,
      onImageChange,
      removeImage,
      paymentMethodOptions,
      paymentStatusOptions,
    };
  },
});
</script>
