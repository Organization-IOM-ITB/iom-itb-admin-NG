<template>
  <div v-if="activity" class="min-h-screen bg-white">

    <!-- Preview Banner -->
    <div class="bg-yellow-50 border-b border-yellow-200 px-6 py-2 flex items-center justify-between sticky top-0 z-20">
      <span class="text-sm text-yellow-700 font-medium flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Mode Preview
        <span v-if="activity.status === 'draft'" class="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs">Draft</span>
      </span>
      <button @click="closeWindow" class="text-sm text-yellow-600 hover:underline">Tutup</button>
    </div>

    <div class="bg-white px-[18px] md:px-[70px] pt-8 pb-10">
      <!-- Header: Thumbnail + Judul/Tag/Tanggal -->
      <div class="flex flex-col md:flex-row gap-8 md:gap-12 mb-10 md:mb-14">
        <div class="w-full md:w-[45%] shrink-0 bg-gray-100 aspect-[16/9] md:aspect-auto md:h-[340px] overflow-hidden rounded-xl">
          <img
            v-if="activity.image"
            :src="activity.image"
            :alt="activity.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-center gap-6">
          <div>
            <h1 class="font-[800] text-[28px] md:text-[38px] leading-tight mb-4 article-copy" style="color: #003793;">
              {{ activity.title }}
            </h1>
            <div v-if="activity.tags?.length > 0" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in activity.tags"
                :key="tag.id"
                class="px-3 py-1 text-xs font-semibold rounded-full"
                style="background-color: #003793; color: white;"
              >
                {{ tag.name }}
              </span>
            </div>
            <p class="text-sm text-gray-400">
              Dipublish pada {{ formatDate(activity.date) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Body: Sidebar kiri + Konten -->
      <div class="flex flex-col md:flex-row gap-8 md:gap-10 items-start mb-10">

        <div class="w-full md:w-80 shrink-0 border border-gray-200 rounded-2xl px-6 py-6 shadow-sm md:sticky md:top-[57px]">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ditulis oleh</p>
          <ul class="mb-5 space-y-1">
            <template v-if="activity.contributors?.length > 0">
              <li
                v-for="(contributor, index) in activity.contributors"
                :key="index"
                class="text-sm text-gray-600 flex items-center gap-2"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"/>
                {{ contributor }}
              </li>
            </template>
            <li v-else class="text-sm text-gray-600 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"/>
              IOM ITB
            </li>
          </ul>

          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dipublikasikan</p>
          <p class="text-sm text-gray-600 mb-5">{{ formatDate(activity.date) }}</p>

          <div v-if="activity.tags?.length > 0">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Kategori</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in activity.tags"
                :key="tag.id"
                class="px-2.5 py-1 text-xs font-semibold rounded-full"
                style="background-color: #003793; color: white;"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex-1 min-w-0 w-full">
          <div
            v-if="activity.description"
            class="activity-content mx-auto mb-8"
            v-html="activity.description"
          />

          <div class="article-actions mx-auto">
            <button
              @click="closeWindow"
              class="inline-flex items-center gap-2 px-4 py-2 text-[16px] font-medium text-white rounded-full hover:opacity-80 transition-opacity"
              style="background-color: #003793;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Tutup Preview
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Loading -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <div class="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"/>
      <p class="text-sm text-gray-400">Memuat preview...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { GET_ACTIVITY_BY_ID } from '@/store/activity.module';

const route = useRoute();
const store = useStore();
const activity = ref<any>(null);
const activityId = computed(() => Number(route.params.id));

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const value = String(dateStr);
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T12:00:00+07:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
};

const closeWindow = () => window.close();

onMounted(async () => {
  activity.value = await store.dispatch(GET_ACTIVITY_BY_ID, activityId.value);
});
</script>

<style scoped>
.activity-content {
  max-width: 760px;
  width: 100%;
  color: #1f2937;
  font-size: 16px;
  line-height: 1.75;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.article-actions {
  max-width: 760px;
  width: 100%;
}
.article-copy {
  overflow-wrap: anywhere;
  word-break: break-word;
}
@media (min-width: 768px) {
  .activity-content {
    font-size: 17px;
  }
}
.activity-content :deep(*) {
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.activity-content :deep(p) { margin-bottom: 1.1rem; }
.activity-content :deep(h1),
.activity-content :deep(h2),
.activity-content :deep(h3) {
  color: #003793;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 0.8rem;
  margin-top: 2rem;
}
.activity-content :deep(h1) { font-size: 2rem; }
.activity-content :deep(h2) { font-size: 1.6rem; }
.activity-content :deep(h3) { font-size: 1.3rem; }
.activity-content :deep(ul),
.activity-content :deep(ol) { padding-left: 1.5rem; margin-bottom: 1rem; }
.activity-content :deep(ul) { list-style-type: disc; }
.activity-content :deep(ol) { list-style-type: decimal; }
.activity-content :deep(li) { margin-bottom: 0.35rem; }
.activity-content :deep(blockquote) {
  border-left: 4px solid #003793;
  padding: 0.75rem 1rem;
  color: #374151;
  font-style: italic;
  margin: 1.5rem 0;
  background-color: #f8fafc;
  border-radius: 0 8px 8px 0;
}
.activity-content :deep(a) { color: #003793; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.activity-content :deep(strong) { font-weight: 700; }
.activity-content :deep(em) { font-style: italic; }
.activity-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 1.5rem auto;
}
.activity-content :deep(div[data-youtube-video]) {
  margin: 1.75rem auto;
  border-radius: 10px;
  overflow: hidden;
  max-width: 760px;
}
.activity-content :deep(div[data-youtube-video] iframe),
.activity-content :deep(iframe) {
  width: 100%;
  aspect-ratio: 16/9;
  height: auto;
  border: none;
  border-radius: 10px;
  display: block;
}
</style>
