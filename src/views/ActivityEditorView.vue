<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <ToastNotification ref="toast" />

    <!-- Top Bar -->
    <div class="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <button
          @click="$router.push('/kegiatan')"
          class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
        <span class="text-sm text-gray-500 truncate">Kegiatan</span>
        <span class="text-gray-300">/</span>
        <span class="text-sm text-gray-700 font-medium truncate max-w-[200px]">{{ form.title || 'Untitled' }}</span>
        <span
          :class="form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
          class="px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0"
        >
          {{ form.status === 'published' ? 'Published' : 'Draft' }}
        </span>
      </div>

      <div class="flex items-center gap-3 flex-shrink-0">
        <span v-if="lastUpdated" class="text-xs text-gray-400 hidden sm:block">Diperbarui: {{ lastUpdated }}</span>
        <span v-if="saveStatus" class="text-xs text-gray-400">{{ saveStatus }}</span>

        <template v-if="form.status === 'draft'">
          <button
            @click="saveAsDraft"
            :disabled="isSaving || !activityId"
            class="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Simpan Draft
          </button>
        </template>
        <template v-else>
          <button
            @click="pullToDraft"
            :disabled="isSaving"
            class="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Tarik ke Draft
          </button>
        </template>

        <button
          @click="previewActivity"
          :disabled="!activityId"
          class="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          Preview
        </button>

        <button
          @click="publish"
          :disabled="isSaving || form.status === 'published'"
          class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          Publish
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden" style="height: calc(100vh - 57px);">

      <!-- Editor Area — scrollable -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto px-10 py-10">
          <input
            v-model="form.title"
            @input="handleTitleInput"
            placeholder="Judul kegiatan..."
            class="w-full text-4xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-200 mb-6 leading-tight"
          />
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <RichTextEditor
              v-model="form.description"
              @change="autoSave"
            />
          </div>
        </div>
      </div>

      <!-- Sidebar Kanan -->
      <div class="w-96 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto min-h-0">

          <!-- Thumbnail -->
          <div class="p-5 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Thumbnail</h3>

            <!-- Preview thumbnail -->
            <div v-if="form.image" class="relative mb-3">
              <img :src="form.image" class="w-full aspect-video object-cover rounded-xl" />
              <button
                @click="removeThumbnail"
                class="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Placeholder -->
            <div v-else class="w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 mb-3">
              <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="text-xs">Belum ada thumbnail</p>
            </div>

            <!-- Toggle upload / url -->
            <div class="flex rounded-md overflow-hidden border border-gray-200 mb-3">
              <button
                @click="thumbnailMode = 'url'"
                :class="thumbnailMode === 'url' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'"
                class="flex-1 py-1.5 text-xs font-medium transition-colors"
              >URL</button>
              <button
                @click="thumbnailMode = 'upload'"
                :class="thumbnailMode === 'upload' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'"
                class="flex-1 py-1.5 text-xs font-medium transition-colors"
              >Upload</button>
            </div>

            <!-- URL input -->
            <div v-if="thumbnailMode === 'url'" class="flex gap-2">
              <input
                v-model="thumbnailUrlInput"
                placeholder="https://..."
                class="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="setThumbnailFromUrl"
              />
              <button
                @click="setThumbnailFromUrl"
                class="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >Set</button>
            </div>

            <!-- Upload input -->
            <div v-else>
              <label class="block w-full px-3 py-2.5 text-xs text-center border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Pilih file gambar...
                <input type="file" accept="image/*" class="hidden" @change="uploadThumbnail" />
              </label>
            </div>
          </div>

          <!-- Contributors -->
          <div class="p-5 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-700 mb-1">Kontributor</h3>
            <p class="text-xs text-gray-400 mb-3">Minimal 1 saat publish</p>

            <div class="flex flex-col gap-2 mb-3">
              <div
                v-for="(contributor, index) in form.contributors"
                :key="index"
                class="flex items-center gap-2"
              >
                <div class="relative flex-1">
                  <input
                    :value="contributor"
                    @input="updateContributor(index, ($event.target as HTMLInputElement).value)"
                    @focus="searchContributors(index)"
                    @blur="closeContributorSuggestions"
                    @keydown.down.prevent="highlightNextContributor"
                    @keydown.up.prevent="highlightPrevContributor"
                    @keydown.enter.prevent="selectHighlightedContributor(index)"
                    placeholder="Nama kontributor..."
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    v-if="activeContributorIndex === index && contributorSuggestions.length > 0"
                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
                  >
                    <button
                      v-for="(suggestion, suggestionIndex) in contributorSuggestions"
                      :key="suggestion"
                      @mousedown.prevent="selectContributor(index, suggestion)"
                      :class="suggestionIndex === contributorHighlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'"
                      class="w-full px-3 py-2 text-xs text-left transition-colors break-words"
                    >
                      {{ suggestion }}
                    </button>
                  </div>
                </div>
                <button
                  @click="removeContributor(index)"
                  class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <button
              @click="addContributor"
              class="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Tambah Kontributor
            </button>
          </div>

          <!-- Tags -->
          <div class="p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-1">Tags</h3>
            <p class="text-xs text-gray-400 mb-3">Maksimal 3 tag</p>

            <!-- Tag chips -->
            <div v-if="form.tags.length > 0" class="flex flex-wrap gap-1.5 mb-3">
              <span
                v-for="(tag, i) in form.tags"
                :key="i"
                class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {{ tag }}
                <button @click="removeTag(i)" class="hover:text-blue-900 transition-colors">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            </div>

            <!-- Input + autocomplete -->
            <div v-if="form.tags.length < 3" class="relative">
              <input
                v-model="tagInput"
                @input="searchTags"
                @keyup.enter="addTagFromInput"
                @keydown.down.prevent="highlightNext"
                @keydown.up.prevent="highlightPrev"
                @keydown.enter.prevent="selectHighlighted"
                @blur="closeTagSuggestions"
                placeholder="Cari atau buat tag..."
                class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <!-- Suggestions dropdown -->
              <div
                v-if="tagSuggestions.length > 0"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
              >
                <button
                  v-for="(suggestion, index) in tagSuggestions"
                  :key="suggestion"
                  @mousedown.prevent="addTag(suggestion)"
                  :class="index === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'"
                  class="w-full px-3 py-2 text-xs text-left transition-colors"
                >
                  {{ suggestion }}
                </button>
              </div>
              <!-- Hint buat tag baru -->
              <p v-if="tagInput && tagSuggestions.length === 0" class="text-xs text-gray-400 mt-1">
                Tekan Enter untuk buat tag "{{ tagInput }}"
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { GET_ACTIVITY_BY_ID, PUT_ACTIVITY, POST_ACTIVITY, GET_TAGS, GET_CONTRIBUTORS } from '@/store/activity.module';
import { POST_ACTIVITY_IMAGE } from '@/store/upload.module';
import Swal from 'sweetalert2';
import RichTextEditor from '@/components/input/RichTextEditor.vue';
import ToastNotification from '@/components/modal/ToastNotification.vue';


const route = useRoute();
const router = useRouter();
const store = useStore();

const activityId = ref<number | null>(route.params.id === 'new' ? null : Number(route.params.id));
const isSaving = ref(false);
const saveStatus = ref('');
const lastUpdated = ref('');

const toast = ref<InstanceType<typeof ToastNotification> | null>(null);

const thumbnailMode = ref<'upload' | 'url'>('url');
const thumbnailUrlInput = ref('');
const tagInput = ref('');
const tagSuggestions = ref<string[]>([]);
const contributorSuggestions = ref<string[]>([]);
const activeContributorIndex = ref<number | null>(null);
let tagSearchTimer: any = null;
let contributorSearchTimer: any = null;

const highlightedIndex = ref(-1);
const contributorHighlightedIndex = ref(-1);

const highlightNext = () => {
  if (tagSuggestions.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value + 1) % tagSuggestions.value.length;
};

const highlightPrev = () => {
  if (tagSuggestions.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value - 1 + tagSuggestions.value.length) % tagSuggestions.value.length;
};

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && tagSuggestions.value[highlightedIndex.value]) {
    addTag(tagSuggestions.value[highlightedIndex.value]);
    highlightedIndex.value = -1;
  } else {
    addTagFromInput();
  }
};


const form = ref({
  title: '',
  description: '',
  url: '',
  image: '',
  status: 'draft' as 'draft' | 'published',
  tags: [] as string[],
  contributors: [] as string[],   
});

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const formatUpdatedAt = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const getJakartaDateString = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

const handleTitleInput = () => {
  if (form.value.status !== 'published') {
    form.value.url = generateSlug(form.value.title);
  }
  autoSave();
};

// Auto save dengan debounce
let saveTimer: any = null;
const autoSave = () => {
  if (!form.value.title) return;
  saveStatus.value = 'Menyimpan...';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveData, 1500);
};

const saveData = async () => {
  if (isSaving.value || !form.value.title) return;
  isSaving.value = true;
  try {
    if (!activityId.value) {
      // Buat baru
      const result = await store.dispatch(POST_ACTIVITY, {
        data: { ...form.value, date: getJakartaDateString(), status: 'draft' }
      });
      activityId.value = result.id;
      lastUpdated.value = formatUpdatedAt(result.updatedAt);
      router.replace({ name: 'KegiatanEditor', params: { id: result.id } });
    } else {
      // Update
      const result = await store.dispatch(PUT_ACTIVITY, {
        id: activityId.value,
        data: { ...form.value }
      });
      if (result?.updatedAt) lastUpdated.value = formatUpdatedAt(result.updatedAt);
    }
    saveStatus.value = 'Tersimpan';
    setTimeout(() => { saveStatus.value = ''; }, 2000);
  } catch {
    saveStatus.value = 'Gagal menyimpan';
  } finally {
    isSaving.value = false;
  }
};

const saveAsDraft = async () => {
  if (!activityId.value) return;
  isSaving.value = true;
  try {
    const result = await store.dispatch(PUT_ACTIVITY, {
      id: activityId.value,
      data: { ...form.value, status: 'draft' }
    });
    if (result?.updatedAt) lastUpdated.value = formatUpdatedAt(result.updatedAt);
    saveStatus.value = 'Tersimpan';
    setTimeout(() => { saveStatus.value = ''; }, 2000);
  } catch {
    saveStatus.value = 'Gagal menyimpan';
  } finally {
    isSaving.value = false;
  }
};

const publish = async () => {
  if (!form.value.title) {
    toast.value?.add('error', 'Judul wajib diisi sebelum publish.');
    return;
  }
  if (!form.value.image) {
    toast.value?.add('error', 'Thumbnail wajib diisi sebelum publish.');
    return;
  }
  if (form.value.contributors.filter(c => c.trim()).length === 0) {
    toast.value?.add('error', 'Minimal 1 kontributor wajib diisi sebelum publish.');
    return;
  }

  const confirm = await Swal.fire({
    title: 'Publish kegiatan ini?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, publish!',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return;

  isSaving.value = true;
  try {
    const result = await store.dispatch(PUT_ACTIVITY, {
      id: activityId.value,
      data: {
        ...form.value,
        status: 'published',
        contributors: form.value.contributors.filter(c => c.trim()), // ✅ buang yang kosong
      }
    });
    form.value.status = 'published';
    if (result?.updatedAt) lastUpdated.value = formatUpdatedAt(result.updatedAt);
    toast.value?.add('success', 'Kegiatan berhasil dipublish!');
  } catch (err: any) {
    const msg = err?.response?.data?.message || 'Gagal publish';
    toast.value?.add('error', msg);
  } finally {
    isSaving.value = false;
  }
};

const pullToDraft = async () => {
  const confirm = await Swal.fire({
    title: 'Tarik kembali ke draft?',
    text: 'Kegiatan tidak akan terlihat publik.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, tarik ke draft',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return;

  isSaving.value = true;
  try {
    const result = await store.dispatch(PUT_ACTIVITY, {
      id: activityId.value,
      data: { ...form.value, status: 'draft' }
    });
    form.value.status = 'draft';
    if (result?.updatedAt) lastUpdated.value = formatUpdatedAt(result.updatedAt);
  } catch {
    Swal.fire({ title: 'Gagal menarik ke draft', icon: 'error' });
  } finally {
    isSaving.value = false;
  }
};

const previewActivity = () => {
  if (!activityId.value) return;
  const resolved = router.resolve({ name: 'KegiatanPreview', params: { id: activityId.value } });
  window.open(resolved.href, '_blank');
};

// Media navigation
const uploadThumbnail = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await store.dispatch(POST_ACTIVITY_IMAGE, file);
  form.value.image = url;
  autoSave();
};

const setThumbnailFromUrl = () => {
  if (!thumbnailUrlInput.value) return;
  try {
    const url = new URL(thumbnailUrlInput.value);
    if (!['https:'].includes(url.protocol)) throw new Error();
    form.value.image = thumbnailUrlInput.value;
    thumbnailUrlInput.value = '';
    autoSave();
  } catch {
    Swal.fire({ title: 'URL tidak valid', icon: 'warning', confirmButtonColor: '#2563eb' });
  }
};

const removeThumbnail = () => {
  form.value.image = '';
  autoSave();
};

const closeTagSuggestions = () => {
  setTimeout(() => { tagSuggestions.value = []; }, 150);
};

const searchTags = () => {
  clearTimeout(tagSearchTimer);
  tagSearchTimer = setTimeout(async () => {
    if (!tagInput.value.trim()) { tagSuggestions.value = []; return; }
    const results = await store.dispatch(GET_TAGS, { search: tagInput.value });
    tagSuggestions.value = (results?.data?.data || results?.data || results || [])
      .map((t: any) => t.name)
      .filter((name: string) => !form.value.tags.includes(name))
      .slice(0, 3);
  }, 300);
};

const addTag = (name: string) => {
  const normalized = name.trim().toLowerCase();
  if (!normalized || form.value.tags.includes(normalized)) return;
  if (form.value.tags.length >= 3) {
    Swal.fire({ title: 'Maksimal 3 tag', icon: 'warning', confirmButtonColor: '#2563eb' });
    return;
  }
  form.value.tags.push(normalized);
  tagInput.value = '';
  tagSuggestions.value = [];
  autoSave();
};

const addTagFromInput = () => {
  if (tagInput.value) addTag(tagInput.value);
};

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1);
  autoSave();
};

const normalizeContributorName = (name: string) => name.trim().replace(/\s+/g, ' ');

type ContributorSuggestionItem = string | { name?: unknown };

const isContributorSuggestionArray = (value: unknown): value is ContributorSuggestionItem[] => {
  return Array.isArray(value);
};

const contributorNamesFromResponse = (results: unknown) => {
  const root = results && typeof results === 'object' ? results as { data?: unknown } : {};
  const nested = root.data && typeof root.data === 'object' ? root.data as { data?: unknown } : {};
  const source = isContributorSuggestionArray(nested.data)
    ? nested.data
    : isContributorSuggestionArray(root.data)
      ? root.data
      : isContributorSuggestionArray(results)
        ? results
        : [];

  return source
    .map((item) => typeof item === 'string' ? item : item.name)
    .filter((name): name is string => typeof name === 'string' && !!name.trim());
};

const clearContributorSuggestions = () => {
  contributorSuggestions.value = [];
  activeContributorIndex.value = null;
  contributorHighlightedIndex.value = -1;
};

const closeContributorSuggestions = () => {
  setTimeout(clearContributorSuggestions, 150);
};

const searchContributors = (index: number) => {
  clearTimeout(contributorSearchTimer);
  activeContributorIndex.value = index;
  contributorHighlightedIndex.value = -1;

  contributorSearchTimer = setTimeout(async () => {
    const query = form.value.contributors[index]?.trim() || '';
    if (!query) {
      contributorSuggestions.value = [];
      return;
    }

    const results = await store.dispatch(GET_CONTRIBUTORS, { search: query, limit: 5 });
    const existingNames = new Set(
      form.value.contributors
        .filter((_, contributorIndex) => contributorIndex !== index)
        .map(name => normalizeContributorName(name).toLowerCase())
        .filter(Boolean)
    );
    const seenSuggestions = new Set<string>();

    contributorSuggestions.value = contributorNamesFromResponse(results)
      .map(normalizeContributorName)
      .filter((name) => {
        const key = name.toLowerCase();
        if (!name || existingNames.has(key) || seenSuggestions.has(key)) return false;
        seenSuggestions.add(key);
        return true;
      })
      .slice(0, 5);
  }, 250);
};

const highlightNextContributor = () => {
  if (contributorSuggestions.value.length === 0) return;
  contributorHighlightedIndex.value = (contributorHighlightedIndex.value + 1) % contributorSuggestions.value.length;
};

const highlightPrevContributor = () => {
  if (contributorSuggestions.value.length === 0) return;
  contributorHighlightedIndex.value = (contributorHighlightedIndex.value - 1 + contributorSuggestions.value.length) % contributorSuggestions.value.length;
};

const selectContributor = (index: number, name: string) => {
  form.value.contributors[index] = normalizeContributorName(name);
  clearContributorSuggestions();
  autoSave();
};

const selectHighlightedContributor = (index: number) => {
  if (contributorHighlightedIndex.value >= 0 && contributorSuggestions.value[contributorHighlightedIndex.value]) {
    selectContributor(index, contributorSuggestions.value[contributorHighlightedIndex.value]);
  } else {
    clearContributorSuggestions();
  }
};

const addContributor = () => {
  form.value.contributors.push('');
  clearContributorSuggestions();
  autoSave();
};

const removeContributor = (index: number) => {
  form.value.contributors.splice(index, 1);
  clearContributorSuggestions();
  autoSave();
};

const updateContributor = (index: number, value: string) => {
  form.value.contributors[index] = value;
  autoSave();
  searchContributors(index);
};

onMounted(async () => {
  // Load activity kalau bukan 'new'
  if (route.params.id !== 'new') {
    const activity = await store.dispatch(GET_ACTIVITY_BY_ID, Number(route.params.id));
    form.value = {
      title: activity.title || '',
      description: activity.description || '',
      url: activity.url || '',
      image: activity.image || '',
      status: activity.status || 'draft',
      tags: (activity.tags || []).map((t: any) => t.name), 
      contributors: activity.contributors || [],
    };
    lastUpdated.value = formatUpdatedAt(activity.updatedAt);
  }

  await nextTick();
});
</script>
