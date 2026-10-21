<template>
  <div class="min-h-screen">
    <Breadcrumb :breadcrumb="title" />

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative">
          <h1 class="text-2xl font-bold tracking-tight md:text-4xl">{{ title }}</h1>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
            Kelola template pesan email dan WhatsApp yang dikirim otomatis kepada pemohon.
          </p>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-5 lg:grid-cols-3">

        <!-- Left: Template list -->
        <div class="flex flex-col gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900">Daftar Template</h2>
            <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {{ filteredTemplates.length }} template
            </span>
          </div>

          <!-- Channel filter tabs -->
          <div class="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              v-for="tab in channelTabs"
              :key="tab.value"
              type="button"
              @click="channelFilter = tab.value"
              class="flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-all"
              :class="channelFilter === tab.value
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'"
            >
              {{ tab.label }}
            </button>
          </div>

          <div v-if="isLoading" class="space-y-2">
            <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-xl bg-slate-100" />
          </div>

          <div v-else-if="!filteredTemplates.length" class="rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <p class="text-sm italic text-slate-400">Tidak ada template.</p>
          </div>

          <div v-else class="space-y-2">
            <button
              v-for="template in filteredTemplates"
              :key="template.key"
              type="button"
              @click="selectTemplate(template)"
              class="w-full rounded-xl border px-3 py-3 text-left transition-all hover:bg-blue-50"
              :class="selectedTemplate?.key === template.key
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white'"
            >
              <div class="flex items-center gap-2.5">
                <!-- Channel icon -->
                <div
                  class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                  :class="template.channel === 'whatsapp' ? 'bg-green-100' : 'bg-blue-50'"
                >
                  <!-- WhatsApp icon -->
                  <svg v-if="template.channel === 'whatsapp'" class="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <!-- Email icon -->
                  <svg v-else class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                  </svg>
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-slate-800">{{ template.title }}</p>
                  <p class="text-xs" :class="template.channel === 'whatsapp' ? 'text-green-600' : 'text-blue-500'">
                    {{ template.channel === 'whatsapp' ? 'WhatsApp' : 'Email' }}
                  </p>
                </div>

                <span
                  class="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  :class="template.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'"
                >
                  {{ template.isActive ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Right: Form + Preview -->
        <div class="space-y-5 lg:col-span-2">

          <!-- Empty state -->
          <div
            v-if="!selectedTemplate"
            class="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 shadow-sm"
          >
            <p class="text-sm italic text-slate-400">Pilih template terlebih dahulu.</p>
          </div>

          <!-- Edit form -->
          <div v-else class="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div class="flex items-center gap-2.5">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="selectedTemplate.channel === 'whatsapp'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'"
                >
                  <svg v-if="selectedTemplate.channel === 'whatsapp'" class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <svg v-else class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                  </svg>
                  {{ selectedTemplate.channel === 'whatsapp' ? 'WhatsApp' : 'Email' }}
                </span>
                <h2 class="text-lg font-bold text-slate-900">{{ selectedTemplate.title }}</h2>
              </div>
              <span
                class="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold"
                :class="selectedTemplate.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ selectedTemplate.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <div class="space-y-5">

              <!-- Subject (email only) -->
              <div v-if="selectedTemplate.channel === 'email'">
                <label class="mb-2 block text-sm font-semibold text-slate-700">Subject Email</label>
                <input
                  v-model="form.subject"
                  type="text"
                  class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Masukkan subject email"
                />
              </div>

              <!-- Body with variable highlighting overlay -->
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">
                  {{ selectedTemplate.channel === 'whatsapp' ? 'Pesan WhatsApp' : 'Isi Pesan Email' }}
                </label>

                <div
                  class="relative rounded-lg border border-slate-200 bg-white transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/30"
                >
                  <!-- Highlighting backdrop -->
                  <div
                    ref="backdropRef"
                    class="body-editor pointer-events-none absolute inset-0 overflow-hidden rounded-lg px-4 py-3"
                    style="color: #334155;"
                    v-html="highlightedBody"
                    aria-hidden="true"
                  />
                  <!-- Editable textarea — global CSS overrides handled via textarea-overlay scoped class -->
                  <textarea
                    ref="textareaRef"
                    v-model="form.body"
                    :rows="selectedTemplate.channel === 'whatsapp' ? 8 : 14"
                    @scroll="syncScroll"
                    class="body-editor textarea-overlay relative w-full resize-none px-4 py-3"
                    :placeholder="selectedTemplate.channel === 'whatsapp'
                      ? 'Masukkan pesan WhatsApp...'
                      : 'Masukkan isi pesan email...'"
                  />
                </div>

                <p class="mt-1.5 text-xs text-slate-400">
                  Variabel yang dikenali ditandai dengan warna biru. Klik nama variabel di bawah untuk menyisipkannya.
                </p>
              </div>

              <!-- Variable chips -->
              <div>
                <p class="mb-2 text-sm font-semibold text-slate-700">Variable yang dapat digunakan</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="variable in parsedVariables"
                    :key="variable"
                    type="button"
                    @click="insertVariable(variable)"
                    class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    {{ variableTag(variable) }}
                  </button>
                  <span v-if="!parsedVariables.length" class="text-xs italic text-slate-400">
                    Tidak ada variabel untuk template ini.
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  class="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
                  @click="resetForm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  class="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                  @click="showPreviewModal = true"
                >
                  Preview & Test
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-blue-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isSaving"
                  @click="saveTemplate"
                >
                  {{ isSaving ? 'Menyimpan...' : 'Simpan Template' }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  </div>

  <!-- Preview & Test modal -->
  <PreviewPesanModal
    v-if="showPreviewModal && selectedTemplate"
    :template="selectedTemplate"
    :body="form.body"
    :subject="form.subject"
    :sample-values="SAMPLE_VALUES"
    @close="showPreviewModal = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import ApiService from '@/store/api.service'
import Swal from 'sweetalert2'
import Breadcrumb from '@/components/AppBreadcrumb.vue'
import PreviewPesanModal from '@/components/modal/PreviewPesanModal.vue'
import { usePermissions } from '@/hooks/usePermissions'
import { canAccessTemplate } from '@/utils/permissions'

type MessageTemplate = {
  id?: number
  key: string
  title: string
  subject?: string | null
  body: string
  variables?: string[] | string
  isActive?: boolean
  channel: 'email' | 'whatsapp'
}

const title = 'Template Pesan'

const templates        = ref<MessageTemplate[]>([])
const selectedTemplate = ref<MessageTemplate | null>(null)
const channelFilter    = ref('')
const isLoading        = ref(false)
const isSaving         = ref(false)
const showPreviewModal = ref(false)
const { selectedRoleId } = usePermissions()

const form = ref({ subject: '', body: '' })

const channelTabs = [
  { value: '',          label: 'Semua' },
  { value: 'email',     label: 'Email' },
  { value: 'whatsapp',  label: 'WhatsApp' },
]

// ── Filtering ──────────────────────────────────────────────────────────────
const filteredTemplates = computed(() =>
  channelFilter.value
    ? templates.value.filter(t => t.channel === channelFilter.value)
    : templates.value
)

// ── Parsed variables ───────────────────────────────────────────────────────
const parsedVariables = computed<string[]>(() => {
  const raw = selectedTemplate.value?.variables
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') {
    try {
      const p = JSON.parse(raw)
      return Array.isArray(p) ? p : []
    } catch { return [] }
  }
  return []
})

// ── Textarea variable highlighting overlay ─────────────────────────────────
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const backdropRef = ref<HTMLDivElement | null>(null)

const syncScroll = () => {
  if (backdropRef.value && textareaRef.value) {
    backdropRef.value.scrollTop  = textareaRef.value.scrollTop
    backdropRef.value.scrollLeft = textareaRef.value.scrollLeft
  }
}

const variableTag = (name: string) => `{{${name}}}`

const escHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const highlightedBody = computed(() => {
  const esc = escHtml(form.value.body)
  return esc.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, varName) =>
    parsedVariables.value.includes(varName)
      ? `<mark style="background:#dbeafe;color:#1d4ed8;border-radius:3px;padding:0 1px;">${match}</mark>`
      : match
  )
})

// ── Insert variable at cursor ──────────────────────────────────────────────
const insertVariable = (variable: string) => {
  const tag = `{{${variable}}}`
  const ta  = textareaRef.value
  if (ta) {
    const start   = ta.selectionStart ?? form.value.body.length
    const end     = ta.selectionEnd   ?? form.value.body.length
    form.value.body = form.value.body.slice(0, start) + tag + form.value.body.slice(end)
    nextTick(() => {
      ta.selectionStart = ta.selectionEnd = start + tag.length
      ta.focus()
    })
  } else {
    form.value.body += `${form.value.body ? ' ' : ''}${tag}`
  }
}

// ── Sample values for preview ──────────────────────────────────────────────
const SAMPLE_VALUES: Record<string, string> = {
  name:              'Budi Santoso',
  username:          'budi.santoso',
  donationType:      'Dana Sosial',
  amount:            '500.000',
  transactionId:     'TXN-2026-001',
  submission_id:     'TLY-ABC1234',
  form_slug:         'pengajuan_bantuan',
  respondent_id:     'RESP-001',
  code:              'ORD-2026-001',
  merchandise_name:  'Kaos IOM ITB',
  merchandiseName:   'Kaos IOM ITB',
  qty:               '2',
  items:             'Kaos IOM ITB (Size: L) x 2',
  order_status_url:  'https://iom-itb.ac.id/orders/ORD-2026-001',
  orderStatusUrl:    'https://iom-itb.ac.id/orders/ORD-2026-001',
  status:            'Dipanggil Wawancara',
  catatan_line:      'Harap membawa dokumen persyaratan lengkap.',
  updated_at:        '10 Mei 2026, 14.30',
}


// ── Data fetching ──────────────────────────────────────────────────────────
const fetchTemplates = async () => {
  isLoading.value = true
  try {
    const res  = await ApiService.get<any>('email-templates')
    const data = Array.isArray(res) ? res : (res as any)?.data || []
    const visibleTemplates = data.filter((template: MessageTemplate) =>
      canAccessTemplate(template, selectedRoleId.value)
    )
    templates.value = visibleTemplates
    if (visibleTemplates.length > 0) {
      selectTemplate(visibleTemplates[0])
    } else {
      selectedTemplate.value = null
      form.value = { subject: '', body: '' }
    }
  } catch (err) {
    console.error(err)
    await Swal.fire({ title: 'Gagal', text: 'Gagal mengambil template pesan.', icon: 'error', confirmButtonColor: '#1e40af', confirmButtonText: 'OK' })
  } finally {
    isLoading.value = false
  }
}

const selectTemplate = (template: MessageTemplate) => {
  selectedTemplate.value = template
  form.value = {
    subject: template.subject || '',
    body:    template.body    || '',
  }
}

const resetForm = () => {
  if (selectedTemplate.value) selectTemplate(selectedTemplate.value)
}

// ── Save ───────────────────────────────────────────────────────────────────
const saveTemplate = async () => {
  if (!selectedTemplate.value) return

  const isEmail = selectedTemplate.value.channel === 'email'

  if (isEmail && !form.value.subject.trim()) {
    await Swal.fire({ title: 'Gagal', text: 'Subject email wajib diisi.', icon: 'error', confirmButtonColor: '#1e40af', confirmButtonText: 'OK' })
    return
  }

  if (!form.value.body.trim()) {
    await Swal.fire({ title: 'Gagal', text: 'Isi pesan wajib diisi.', icon: 'error', confirmButtonColor: '#1e40af', confirmButtonText: 'OK' })
    return
  }

  isSaving.value = true
  try {
    const payload: Record<string, string> = { body: form.value.body }
    if (isEmail) payload.subject = form.value.subject

    await ApiService.put<any>(`email-templates/${selectedTemplate.value.key}`, payload)

    await Swal.fire({ title: 'Berhasil', text: 'Template berhasil disimpan.', icon: 'success', confirmButtonColor: '#1e40af', confirmButtonText: 'OK' })

    await fetchTemplates()
    const updated = templates.value.find(t => t.key === selectedTemplate.value?.key)
    if (updated) selectTemplate(updated)
  } catch (err) {
    console.error(err)
    await Swal.fire({ title: 'Gagal', text: 'Gagal menyimpan template.', icon: 'error', confirmButtonColor: '#1e40af', confirmButtonText: 'OK' })
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchTemplates)
</script>

<style scoped>
/* Shared font metrics for the overlay to stay in sync with the textarea */
.body-editor {
  font-family: inherit;
  font-size: 0.875rem;   /* text-sm */
  line-height: 1.625;    /* leading-relaxed */
  white-space: pre-wrap;
  word-break: break-words;
  overflow-wrap: break-word;
  letter-spacing: normal;
  tab-size: 4;
}

/*
 * Override the global tailwind.css rules which force
 * background-color:#fff !important and border-width:1px !important on textarea.
 * This restores the transparent overlay behavior.
 */
.textarea-overlay {
  background-color: transparent !important;
  color: transparent !important;
  caret-color: #334155 !important;
  border-width: 0 !important;
  border-color: transparent !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>
