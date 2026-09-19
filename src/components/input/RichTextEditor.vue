<template>
  <div class="rich-editor-wrapper">
    <!-- Toolbar -->
    <div v-if="editor" class="ql-toolbar flex flex-wrap items-center gap-1 p-2 border-b border-gray-200">
      <!-- Text formatting -->
      <button @click="editor.chain().focus().toggleBold().run()" :class="editor.isActive('bold') ? 'is-active' : ''" class="toolbar-btn" title="Bold">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="editor.isActive('italic') ? 'is-active' : ''" class="toolbar-btn" title="Italic">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
      </button>
      <button @click="editor.chain().focus().toggleUnderline().run()" :class="editor.isActive('underline') ? 'is-active' : ''" class="toolbar-btn" title="Underline">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="editor.isActive('strike') ? 'is-active' : ''" class="toolbar-btn" title="Strikethrough">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6C16 6 14.5 4 12 4C9.5 4 7 5.5 7 8C7 10.5 9 11.5 12 12"/><path d="M8 18C8 18 9.5 20 12 20C14.5 20 17 18.5 17 16C17 13.5 15 12.5 12 12"/></svg>
      </button>

      <div class="w-px h-5 bg-gray-200 mx-1"/>

      <!-- Headings -->
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="editor.isActive('heading', { level: 1 }) ? 'is-active' : ''" class="toolbar-btn text-xs font-bold" title="H1">H1</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="editor.isActive('heading', { level: 2 }) ? 'is-active' : ''" class="toolbar-btn text-xs font-bold" title="H2">H2</button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="editor.isActive('heading', { level: 3 }) ? 'is-active' : ''" class="toolbar-btn text-xs font-bold" title="H3">H3</button>

      <div class="w-px h-5 bg-gray-200 mx-1"/>

      <!-- Lists -->
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="editor.isActive('bulletList') ? 'is-active' : ''" class="toolbar-btn" title="Bullet list">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="editor.isActive('orderedList') ? 'is-active' : ''" class="toolbar-btn" title="Ordered list">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10H6"/><path d="M6 18H4l2-2a1.5 1.5 0 0 0-2.7-.9"/></svg>
      </button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="editor.isActive('blockquote') ? 'is-active' : ''" class="toolbar-btn" title="Blockquote">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
      </button>

      <div class="w-px h-5 bg-gray-200 mx-1"/>

      <!-- Alignment -->
      <button @click="editor.chain().focus().setTextAlign('left').run()" :class="editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''" class="toolbar-btn" title="Align left">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <button @click="editor.chain().focus().setTextAlign('center').run()" :class="editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''" class="toolbar-btn" title="Align center">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <button @click="editor.chain().focus().setTextAlign('right').run()" :class="editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''" class="toolbar-btn" title="Align right">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <div class="w-px h-5 bg-gray-200 mx-1"/>

      <!-- Link -->
      <button @click="setLink" :class="editor.isActive('link') ? 'is-active' : ''" class="toolbar-btn" title="Link">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </button>

      <!-- Image -->
      <button @click="addImage" class="toolbar-btn" title="Gambar">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </button>

      <!-- YouTube -->
      <button @click="addYoutube" class="toolbar-btn" title="YouTube">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
      </button>

      <div class="w-px h-5 bg-gray-200 mx-1"/>

      <!-- Undo/Redo -->
      <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" class="toolbar-btn" title="Undo">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
      </button>
      <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" class="toolbar-btn" title="Redo">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
      </button>

      <!-- Clear -->
      <button @click="editor.chain().focus().clearNodes().unsetAllMarks().run()" class="toolbar-btn" title="Clear formatting">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
      </button>
    </div>

    <!-- Editor -->
    <EditorContent :editor="editor" class="tiptap-editor" />

    <!-- Image resize toolbar — muncul saat image dipilih -->
    <div
      v-if="selectedImageEl"
      class="image-toolbar fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center gap-1 px-2 py-1.5"
      :style="imageToolbarStyle"
    >
      <button v-for="size in imageSizes" :key="size.value"
        @click="setImageWidth(size.value)"
        :class="currentImageWidth === size.value ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'"
        class="px-2 py-1 text-xs rounded font-medium transition-colors"
      >{{ size.label }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useStore } from 'vuex';
import { POST_ACTIVITY_IMAGE } from '@/store/upload.module';
import Swal from 'sweetalert2';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change'): void;
}>();

const store = useStore();

const selectedImageEl = ref<HTMLImageElement | null>(null);
const imageToolbarStyle = ref({});
const currentImageWidth = ref('original');

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: el => el.getAttribute('style'),
        renderHTML: attrs => attrs.style ? { style: attrs.style } : {},
      },
    };
  },
});

const imageSizes = [
  { label: 'S', value: '25%' },
  { label: 'M', value: '50%' },
  { label: 'L', value: '75%' },
  { label: 'XL', value: '90%' },
  { label: 'Orig', value: 'original' },
];

const setImageWidth = (width: string) => {
  if (!editor.value) return;
  currentImageWidth.value = width;
  editor.value.chain().focus().updateAttributes('image', {
    style: width === 'original' ? '' : `width: ${width}; height: auto;`
  }).run();
};

const updateToolbarPos = () => {
  if (!selectedImageEl.value) return;
  const rect = selectedImageEl.value.getBoundingClientRect();
  imageToolbarStyle.value = {
    top: `${rect.top + window.scrollY - 44}px`,
    left: `${rect.left + window.scrollX}px`,
  };
};

const handleImageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'IMG') {
    selectedImageEl.value = target as HTMLImageElement;
    currentImageWidth.value = (target as HTMLImageElement).style.width || 'original';
    updateToolbarPos();
  } else if (selectedImageEl.value && !target.closest('.image-toolbar')) {
    selectedImageEl.value = null;
  }
};

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
    Underline,
    CustomImage.configure({
      inline: true,
      allowBase64: false,
      HTMLAttributes: {},
    }),
    Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
    Youtube.configure({ width: 800, height: 400 }),
    TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
  ],
  editorProps: {
    attributes: {
      class: 'tiptap-content',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
    emit('change');
  },
});

const setLink = () => {
  const prev = editor.value?.getAttributes('link').href || '';
  Swal.fire({
    title: 'Tambah Link',
    input: 'text',
    inputValue: prev,
    inputPlaceholder: 'https://...',
    showCancelButton: true,
    confirmButtonText: 'Set',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    cancelButtonText: 'Batal',
  }).then(result => {
    if (result.isConfirmed) {
      if (!result.value) {
        editor.value?.chain().focus().unsetLink().run();
      } else {
        editor.value?.chain().focus().setLink({ href: result.value }).run();
      }
    }
  });
};

const addImage = () => {
  Swal.fire({
    title: 'Tambah Gambar',
    html: `
      <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
        <div>
          <label style="font-size:13px;color:#6b7280;display:block;margin-bottom:4px">Upload dari komputer</label>
          <input id="swal-img-file" type="file" accept="image/*" style="font-size:13px;width:100%"/>
        </div>
        <div style="text-align:center;color:#9ca3af;font-size:12px">— atau —</div>
        <div>
          <label style="font-size:13px;color:#6b7280;display:block;margin-bottom:4px">URL Gambar</label>
          <input id="swal-img-url" type="text" placeholder="https://..." style="width:100%;padding:6px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px"/>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    cancelButtonText: 'Batal',
    preConfirm: async () => {
      const file = (document.getElementById('swal-img-file') as HTMLInputElement)?.files?.[0];
      const url = (document.getElementById('swal-img-url') as HTMLInputElement)?.value;
      if (file) return await store.dispatch(POST_ACTIVITY_IMAGE, file);
      if (url) {
        try { new URL(url); return url; }
        catch { Swal.showValidationMessage('URL tidak valid'); }
      } else {
        Swal.showValidationMessage('Pilih file atau masukkan URL');
      }
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      editor.value?.chain().focus().setImage({ src: result.value }).run();
    }
  });
};

const getYoutubeVideoId = (value: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const url = new URL(hasProtocol ? trimmed : `https://${trimmed}`);
    const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
    const segments = url.pathname.split('/').filter(Boolean);
    let videoId: string | null = null;

    if (host === 'youtu.be') {
      videoId = segments[0] || null;
    } else if (host === 'youtube.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else if (['live', 'embed'].includes(segments[0])) {
        videoId = segments[1] || null;
      }
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
};

const normalizeYoutubeUrl = (value: string) => {
  const videoId = getYoutubeVideoId(value);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
};

const addYoutube = () => {
  Swal.fire({
    title: 'Tambah Video YouTube',
    input: 'text',
    inputPlaceholder: 'https://youtube.com/watch?v=... atau https://youtube.com/live/...',
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    cancelButtonText: 'Batal',
    inputValidator: (value) => {
      if (!normalizeYoutubeUrl(value)) return 'URL YouTube tidak valid';
    }
  }).then(result => {
    if (result.isConfirmed) {
      const normalizedUrl = normalizeYoutubeUrl(result.value);
      if (normalizedUrl) {
        editor.value?.chain().focus().setYoutubeVideo({ src: normalizedUrl }).run();
      }
    }
  });
};

watch(() => props.modelValue, (val) => {
  if (!editor.value) return;
  if (editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val || ''); // HAPUS argument false
  }
});

onMounted(() => {
  document.addEventListener('click', handleImageClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleImageClick);
  editor.value?.destroy();
});
</script>

<style>
.rich-editor-wrapper {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: visible;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  color: #4b5563;
  transition: background-color 0.15s;
  min-width: 28px;
  min-height: 28px;
}
.toolbar-btn:hover { background-color: #f3f4f6; }
.toolbar-btn.is-active { background-color: #dbeafe; color: #2563eb; }
.toolbar-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.tiptap-editor .ProseMirror {
  min-height: 600px;
  padding: 20px 24px;
  line-height: 1.7;
  outline: none;
  font-size: 16px;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tiptap-editor .ProseMirror * {
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tiptap-editor .ProseMirror p { margin-bottom: 1rem; }
.tiptap-editor .ProseMirror h1 { font-size: 1.75rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
.tiptap-editor .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
.tiptap-editor .ProseMirror h3 { font-size: 1.25rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
.tiptap-editor .ProseMirror blockquote {
  border-left: 4px solid #003793;
  padding-left: 1rem;
  color: #666;
  font-style: italic;
  margin: 1rem 0;
}
.tiptap-editor .ProseMirror a { color: #2563eb; text-decoration: underline; cursor: pointer; }
.tiptap-editor .ProseMirror img {
  max-width: 100%;
  height: auto;
  cursor: pointer;
  display: inline-block;
}
.tiptap-editor .ProseMirror img.ProseMirror-selectednode {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
.tiptap-editor .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
.tiptap-editor .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
.tiptap-editor .ProseMirror li { margin-bottom: 0.25rem; }
.tiptap-editor .ProseMirror .youtube-wrapper {
  width: 100%;
  margin: 1rem 0;
}
.tiptap-editor .ProseMirror iframe {
  width: 100%;
  aspect-ratio: 16/9;
  border: none;
  border-radius: 8px;
}
.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
  color: #d1d5db;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
