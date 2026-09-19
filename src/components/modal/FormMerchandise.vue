<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" class="w-full max-w-[760px]" @click.stop>
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <h3 class="text-lg font-bold capitalize text-slate-900">{{ title }}</h3>
              <p class="mt-1 text-sm text-slate-500">Lengkapi informasi produk yang akan tampil di katalog.</p>
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
                  <label class="text-sm font-semibold text-slate-900">Nama Produk <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Nama merchandise yang tampil di katalog.</p>
                </div>
                <input
                  v-model="formData.data.name"
                  type="text"
                  required
                  class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
                  placeholder="mis. Kaos IOM ITB"
                />
              </div>

              <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Stok & Harga <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Jumlah stok, harga jual, dan HPP internal.</p>
                </div>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    v-model="formData.data.stock"
                    type="number"
                    min="0"
                    required
                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
                    placeholder="Stok"
                  />
                  <input
                    :value="formatCurrencyInput(formData.data.price)"
                    type="text"
                    inputmode="numeric"
                    required
                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
                    placeholder="Rp 0"
                    @input="onPriceInput"
                  />
                  <input
                    :value="formatCurrencyInput(formData.data.hpp)"
                    type="text"
                    inputmode="numeric"
                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
                    placeholder="HPP Rp 0"
                    @input="onHppInput"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Kategori</label>
                  <p class="mt-0.5 text-xs text-slate-400">Kelompok produk untuk filter katalog.</p>
                </div>
                <div>
                  <AppSelect
                    :model-value="selectedKategori"
                    :options="kategoriSelectOptions"
                    button-class="bg-white text-slate-800"
                    @change="onKategoriChange"
                  />
                  <input
                    v-if="showNewKategori"
                    v-model="newKategoriInput"
                    type="text"
                    placeholder="Nama kategori baru"
                    class="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
                    @input="updateValue({ key: 'kategori', value: newKategoriInput })"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-start">
                <div class="md:pt-2">
                  <label class="text-sm font-semibold text-slate-900">Deskripsi <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Ringkasan produk untuk halaman publik.</p>
                </div>
                <textarea
                  v-model="formData.data.description"
                  rows="3"
                  required
                  class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
                  placeholder="Deskripsi singkat produk..."
                ></textarea>
              </div>

              <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Link Pembelian</label>
                  <p class="mt-0.5 text-xs text-slate-400">Gunakan link ITB Press bila tersedia.</p>
                </div>
                <input
                  v-model="formData.data.link"
                  type="url"
                  class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
                  placeholder="https://itbpress.id/..."
                />
              </div>

              <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-start">
                <div class="md:pt-2">
                  <label class="text-sm font-semibold text-slate-900">Gambar Produk</label>
                  <p class="mt-0.5 text-xs text-slate-400">Masukkan URL gambar atau unggah JPG/PNG maksimal 5 MB.</p>
                </div>
                <div class="space-y-3">
                  <div class="flex flex-wrap gap-2">
                    <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                      <input v-model="imageMode" type="radio" value="url" class="text-blue-700 focus:ring-blue-500" />
                      URL
                    </label>
                    <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                      <input v-model="imageMode" type="radio" value="upload" class="text-blue-700 focus:ring-blue-500" />
                      Upload
                    </label>
                  </div>

                  <input
                    v-if="imageMode === 'url'"
                    v-model="imageUrl"
                    type="url"
                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
                    placeholder="https://..."
                    @input="onImageUrlInput"
                  />

                  <input
                    v-else
                    type="file"
                    accept="image/jpeg,image/png"
                    class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    @change="onImageFileChange"
                  />
                  <p v-if="imageMode === 'upload'" class="text-xs text-slate-400">Format JPG/PNG, maksimal 5 MB.</p>

                  <div v-if="imagePreview" class="flex items-center gap-3">
                    <img :src="imagePreview" alt="Preview produk" class="h-16 w-16 rounded-lg border border-slate-200 object-cover" />
                    <button type="button" class="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100" @click="removeImage">
                      Hapus Gambar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4">
            <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none">
              Batal
            </button>
            <button type="submit" :disabled="isLoading" class="rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60">
              {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { POST_MERCHANDISE, PUT_MERCHANDISE } from "@/store/merchandise.module";
import { POST_IMAGE } from "@/store/upload.module";
import { showError } from '@/utils/swal';
import ApiService from '@/store/api.service';
import AppSelect from '@/components/input/AppSelect.vue';
import type { ApiDataResponse, ApiErrorResponse, MerchandisePayload } from '@/types/domain';

type CategoryResponse = ApiDataResponse<string[]> | string[];

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);

export default defineComponent({
  components: {
    AppSelect,
  },
  props: {
    title: {
      type: String,
      required: true
    },
    id:{
      type: String,
      required: false
    },
    data: {
      type: Object,
      required: false,
      default: () => ({}) // Provide a default object to prevent undefined errors
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const initialData = props.data as MerchandisePayload;
    const modalContent = ref(null);
    const isLoading = ref(false);
    const formData = reactive({
      id: '',
      data: { ...initialData } as MerchandisePayload,
    });

    const kategoriOptions = ref<string[]>(['Stiker', 'Busana', 'ATK']);
    const selectedKategori = ref<string>(String(initialData.kategori || ''));
    const showNewKategori = ref(false);
    const newKategoriInput = ref('');
    const imageMode = ref<'url' | 'upload'>(typeof initialData.image === 'string' && initialData.image ? 'url' : 'upload');
    const imageUrl = ref(typeof initialData.image === 'string' ? initialData.image : '');
    const imagePreview = ref(typeof initialData.image === 'string' ? initialData.image : '');
    const kategoriSelectOptions = computed(() => [
      { value: '', label: 'Pilih Kategori' },
      ...kategoriOptions.value.map((kategori) => ({ value: kategori, label: kategori })),
      { value: '__new__', label: 'Tambah Kategori Baru' },
    ]);

    onMounted(async () => {
      try {
        const res = await ApiService.get<CategoryResponse>('/merchandises/categories');
        const categories = Array.isArray(res) ? res : res.data;
        if (Array.isArray(categories)) kategoriOptions.value = categories;
      } catch { /* fallback ke default */ }
    });

    const onKategoriChange = (value: string | number | boolean | null | undefined) => {
      const val = String(value || '');
      if (val === '__new__') {
        showNewKategori.value = true;
        selectedKategori.value = '__new__';
        formData.data['kategori'] = '';
      } else {
        showNewKategori.value = false;
        newKategoriInput.value = '';
        selectedKategori.value = val;
        formData.data['kategori'] = val || '';
      }
    };

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const updateValue = (params: { key: string; value: unknown }) => {
      formData.data[params.key] = params.value;
    };

    const formatCurrencyInput = (value: unknown) => {
      const numberValue = Number(String(value || '').replace(/\D/g, ''));
      if (!numberValue) return '';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(numberValue);
    };

    const onPriceInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const rawValue = input.value.replace(/\D/g, '');
      formData.data.price = rawValue ? Number(rawValue) : '';
      input.value = formatCurrencyInput(formData.data.price);
    };

    const onHppInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const rawValue = input.value.replace(/\D/g, '');
      formData.data.hpp = rawValue ? Number(rawValue) : '';
      input.value = formatCurrencyInput(formData.data.hpp);
    };

    const onImageUrlInput = () => {
      formData.data.image = imageUrl.value;
      imagePreview.value = imageUrl.value;
    };

    const onImageFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        input.value = '';
        showError('Gambar tidak valid', 'Format gambar harus JPG atau PNG.');
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        input.value = '';
        showError('Gambar terlalu besar', `Ukuran gambar maksimal ${MAX_IMAGE_SIZE_MB} MB.`);
        return;
      }

      formData.data.image = file;
      const reader = new FileReader();
      reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        imagePreview.value = String(loadEvent.target?.result || '');
      };
      reader.readAsDataURL(file);
    };

    const removeImage = () => {
      imageUrl.value = '';
      imagePreview.value = '';
      formData.data.image = '';
      imageMode.value = 'upload';
    };

    const handleSubmit = async () => {
      isLoading.value = true;

      const errors: string[] = [];

      const requiredFields: Record<string, string> = {
        name: 'Nama',
        stock: 'Stok',
        price: 'Harga',
        description: 'Deskripsi',
      };
      for (const [field, label] of Object.entries(requiredFields)) {
        const val = formData.data[field];
        if (val === undefined || val === null || val === '') {
          errors.push(`${label} wajib diisi.`);
        }
      }

      const stockValue = Number(formData.data.stock);
      if (formData.data.stock !== undefined && formData.data.stock !== '') {
        if (stockValue < 0) {
          errors.push('Stok tidak boleh bernilai negatif.');
        } else if (!Number.isInteger(stockValue)) {
          errors.push('Stok harus berupa bilangan bulat (tidak boleh menggunakan koma).');
        }
      }

      const hppValue = Number(formData.data.hpp || 0);
      if (formData.data.hpp !== undefined && formData.data.hpp !== '') {
        if (!Number.isFinite(hppValue) || hppValue < 0) {
          errors.push('HPP tidak boleh bernilai negatif.');
        }
      } else {
        formData.data.hpp = 0;
      }

      const link = typeof formData.data.link === 'string' ? formData.data.link : '';
      if (link && link.trim() !== '') {
        try {
          const url = new URL(link);
          const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
          const isItbPressDomain = hostname === 'itbpress.id' || hostname.endsWith('.itbpress.id');
          if (!isItbPressDomain) {
            errors.push('Link harus menggunakan domain ITB Press (itbpress.id).');
          }
        } catch {
          errors.push('Masukkan URL yang benar (contoh: https://itbpress.id/...).');
        }
      }

      if (errors.length > 0) {
        showError('Error', errors);
        isLoading.value = false;
        return;
      }
      try {
        if(formData?.data?.image){
          if(typeof formData?.data?.image !== "string") {
            const response = await store.dispatch(POST_IMAGE, formData);
            formData.data.image = response || "";
          }
          formData.data.image = formData?.data?.image || "";
        }
        if(props?.id){
          formData.id = props?.id
          await store.dispatch(PUT_MERCHANDISE, formData);
        }else{
          await store.dispatch(POST_MERCHANDISE, formData);
        }
        closeModal();
      } catch (error: unknown) {
        const apiError = error as ApiErrorResponse;
        showError('Error', apiError?.response?.data?.message || apiError?.message || 'Terjadi kesalahan, coba lagi.');
        isLoading.value = false;
      }
    };

    return {
      modalContent,
      closeModal,
      handleSubmit,
      updateValue,
      isLoading,
      kategoriOptions,
      kategoriSelectOptions,
      selectedKategori,
      showNewKategori,
      newKategoriInput,
      onKategoriChange,
      formData,
      imageMode,
      imageUrl,
      imagePreview,
      formatCurrencyInput,
      onPriceInput,
      onHppInput,
      onImageUrlInput,
      onImageFileChange,
      removeImage,
    };
  },
});
</script>
