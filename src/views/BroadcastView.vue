<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="Broadcast" />

    <!-- Modal Form Setting -->
    <FormBroadcastSetting
      v-if="modalOpen"
      :title="editingId ? 'Edit Pengaturan Broadcast' : 'Tambah Pengaturan Broadcast'"
      :data="editingData"
      :id="editingId"
      @close="handleModalClose"
    />

    <!-- Modal Form Recipient -->
    <FormBroadcastRecipient
      v-if="addRecipientModalOpen"
      @close="handleRecipientModalClose"
    />

    <div v-if="editRecipientModalOpen" class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" @click.self="closeRecipientModal">
      <div class="w-full max-w-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <form @submit.prevent="saveRecipient">
          <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Edit Penerima Default</h3>
              <p class="mt-1 text-sm text-slate-500">Perbarui kontak yang dipakai sebagai daftar broadcast default.</p>
            </div>
            <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeRecipientModal">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="divide-y divide-slate-100">
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[150px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">Nama <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Nama penerima pesan.</p>
              </div>
              <input
                v-model="recipientForm.name"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Nama penerima"
              />
            </div>
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[150px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">NIM / Relasi</label>
                <p class="mt-0.5 text-xs text-slate-400">Identitas atau relasi penerima.</p>
              </div>
              <input
                v-model="recipientForm.nim"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="13523062 atau Orang Tua Asuh"
              />
            </div>
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[150px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">WhatsApp</label>
                <p class="mt-0.5 text-xs text-slate-400">Nomor untuk kanal WA.</p>
              </div>
              <input
                v-model="recipientForm.noWhatsapp"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="628..."
              />
            </div>
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[150px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">Email</label>
                <p class="mt-0.5 text-xs text-slate-400">Alamat untuk kanal email.</p>
              </div>
              <input
                v-model="recipientForm.email"
                type="email"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="nama@email.com"
              />
            </div>
            <p class="px-5 py-3 text-xs text-slate-400">Minimal salah satu dari WhatsApp atau Email wajib diisi.</p>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
            <button type="button" @click="closeRecipientModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
              Batal
            </button>
            <button type="submit" :disabled="savingRecipient" class="rounded-lg bg-[#003793] px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
              {{ savingRecipient ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-8 space-y-5">
      <!-- ── Page Header ─────────────────────────────────────────── -->
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold md:text-4xl">Broadcast Pesan</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Kelola pengaturan pesan massal via WhatsApp dan Email untuk pengingat donasi dan iuran.
            </p>
          </div>
          <button
            class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
            @click="openAdd"
          >
            <IcPlus class="w-4 h-4"/>
            Tambah Pengaturan
          </button>
        </div>
      </section>

      <!-- ── KPI Cards / Status ─────────────────────────────────────────── -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div 
          @click="activeTab = 'settings'"
          class="cursor-pointer rounded-2xl border-2 bg-white p-5 shadow-sm transition-all"
          :class="activeTab === 'settings' ? 'border-[#003793] shadow-md' : 'border-slate-200 hover:border-blue-300'"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-500">Pengaturan</p>
              <p class="mt-1 text-2xl font-black text-slate-900">{{ settings.length }}</p>
            </div>
          </div>
        </div>

        <div 
          @click="activeTab = 'recipients'"
          class="cursor-pointer rounded-2xl border-2 bg-white p-5 shadow-sm transition-all"
          :class="activeTab === 'recipients' ? 'border-[#003793] shadow-md' : 'border-slate-200 hover:border-emerald-300'"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-500">Penerima</p>
              <p class="mt-1 text-2xl font-black text-slate-900">{{ members.length > 0 ? members.length : 'Lihat' }}</p>
            </div>
          </div>
        </div>

        <div 
          @click="activeTab = 'logs'"
          class="cursor-pointer rounded-2xl border-2 bg-white p-5 shadow-sm transition-all"
          :class="activeTab === 'logs' ? 'border-[#003793] shadow-md' : 'border-slate-200 hover:border-amber-300'"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-500">Log Pengiriman</p>
              <p class="mt-1 text-2xl font-black text-slate-900">{{ logs.pagination?.total || 'Cek' }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Main Content Area ─────────────────────────────────────────── -->
      
      <!-- Tab: Settings -->
      <div v-if="activeTab === 'settings'" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">Daftar Pengaturan</h2>
            <p class="mt-1 text-xs text-slate-500">Konfigurasi pesan dan jadwal otomatis.</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-blue-900">
              <tr>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold text-blue-100">Nama</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold text-blue-100">Jenis Iuran</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold text-blue-100">Interval</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold text-blue-100">Jadwal</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold text-blue-100">Status</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold text-blue-100">Terakhir Dikirim</th>
                <th class="px-4 py-3.5 text-center text-[11px] font-bold text-blue-100">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="loadingSettings">
                <td colspan="7" class="px-6 py-10 text-center">
                  <div class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#003793] border-t-transparent"></div>
                  <p class="mt-2 text-sm font-medium text-slate-500">Memuat data...</p>
                </td>
              </tr>
              <tr v-else-if="!settings.length">
                <td colspan="7" class="px-6 py-10 text-center text-sm text-slate-400 italic">Belum ada pengaturan broadcast.</td>
              </tr>
              <tr v-else v-for="s in settings" :key="s.id" class="transition-colors hover:bg-blue-50/40">
                <td class="px-4 py-4 font-bold text-slate-900">{{ s.name }}</td>
                <td class="px-4 py-4 text-slate-600">{{ s.jenisIuran }}</td>
                <td class="px-4 py-4">
                  <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 capitalize">
                    {{ s.scheduleInterval === '3months' ? '3 Bulan' : s.scheduleInterval === 'monthly' ? 'Bulanan' : 'Mingguan' }}
                  </span>
                </td>
                <td class="px-4 py-4 font-medium text-slate-600">{{ scheduleDayLabel(s) }}</td>
                <td class="px-4 py-4">
                  <span :class="s.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'" class="rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-tight">
                    {{ s.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-4 py-4 text-xs text-slate-500">{{ s.lastRunAt ? formatDate(s.lastRunAt) : '-' }}</td>
                <td class="px-4 py-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button 
                      class="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                      :disabled="blasting === s.id"
                      @click="runNow(s.id)"
                      title="Kirim Sekarang"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      {{ blasting === s.id ? 'Mengirim...' : 'Blast' }}
                    </button>
                    <button class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit" @click="openEdit(s)">
                      <IcEdit class="w-4 h-4"/>
                    </button>
                    <button class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus" @click="deleteSetting(s.id)">
                      <IcTrash class="w-4 h-4"/>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Penerima -->
      <div v-if="activeTab === 'recipients'" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">Daftar Penerima Default</h2>
            <p class="mt-1 text-xs text-slate-500">Anggota yang akan menerima broadcast jika setting tidak menentukan penerima sendiri.</p>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-full bg-[#003793] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            @click="openAddRecipient"
          >
            <IcPlus class="w-4 h-4"/>
            Tambah Penerima
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-blue-900">
              <tr>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">Nama</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">NIM / Relasi</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">No. WhatsApp</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">Email</th>
                <th class="px-6 py-3.5 text-right text-[11px] font-bold text-blue-100">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="loadingMembers">
                <td colspan="5" class="px-6 py-10 text-center">
                  <div class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#003793] border-t-transparent"></div>
                  <p class="mt-2 text-sm font-medium text-slate-500">Memuat kontak...</p>
                </td>
              </tr>
              <tr v-else-if="!members.length">
                <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-400 italic">Belum ada penerima. Klik "Tambah Penerima" untuk menambah.</td>
              </tr>
              <tr v-else v-for="m in members" :key="m.id" class="transition-colors hover:bg-blue-50/40">
                <td class="px-6 py-4 font-bold text-slate-900">{{ m.name }}</td>
                <td class="px-6 py-4 text-slate-600 font-medium">{{ m.nim || '-' }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    {{ m.noWhatsapp || '-' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ m.email || '-' }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="mr-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100" @click="openRecipientEdit(m)">
                    <IcEdit class="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button class="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100" title="Hapus" @click="deleteRecipient(m.id)">
                    <IcTrash class="h-3.5 w-3.5"/>
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Log -->
      <div v-if="activeTab === 'logs'" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-base font-bold text-slate-900">Log Pengiriman</h2>
            <p class="mt-1 text-xs text-slate-500">Histori status broadcast.</p>
          </div>
          <div class="w-full sm:w-64">
            <AppSelect
              v-model="logFilterId"
              :options="broadcastFilterOptions"
              @change="() => { logPage = 1; loadLogs(); }"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-blue-900">
              <tr>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">Waktu</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">Broadcast</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">Penerima</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">Kanal WhatsApp</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold text-blue-100">Kanal Email</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="loadingLogs">
                <td colspan="5" class="px-6 py-10 text-center">
                  <div class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#003793] border-t-transparent"></div>
                  <p class="mt-2 text-sm font-medium text-slate-500">Memuat log...</p>
                </td>
              </tr>
              <tr v-else-if="!logs.data?.length">
                <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-400 italic">Belum ada riwayat pengiriman.</td>
              </tr>
              <tr v-else v-for="l in logs.data" :key="l.id" class="transition-colors hover:bg-blue-50/40">
                <td class="px-6 py-4 text-xs font-medium text-slate-500">{{ formatDate(l.sentAt) }}</td>
                <td class="px-6 py-4 font-bold text-slate-900">{{ l.broadcastName }}</td>
                <td class="px-6 py-4 text-slate-700">{{ l.recipientName || '-' }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col items-start gap-1">
                    <span class="text-xs font-mono text-slate-500">{{ l.waNumber || '-' }}</span>
                    <span :class="statusClass(l.waStatus)" class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tight border">{{ l.waStatus }}</span>
                    <span v-if="l.waError" class="max-w-[220px] truncate text-[11px] text-rose-600" :title="l.waError">{{ l.waError }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col items-start gap-1">
                    <span class="text-xs text-slate-500">{{ l.email || '-' }}</span>
                    <span :class="statusClass(l.emailStatus)" class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tight border">{{ l.emailStatus }}</span>
                    <span v-if="l.emailError" class="max-w-[220px] truncate text-[11px] text-rose-600" :title="l.emailError">{{ l.emailError }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="logs.pagination?.totalPages > 1" class="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <span class="text-xs font-medium text-slate-500">Halaman {{ logPage }} dari {{ logs.pagination?.totalPages }}</span>
          <div class="flex gap-2">
            <button
              class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              :disabled="logPage <= 1"
              @click="() => { logPage--; loadLogs(); }"
            >Prev</button>
            <button
              class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              :disabled="logPage >= logs.pagination?.totalPages"
              @click="() => { logPage++; loadLogs(); }"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import Breadcrumb from '@/components/AppBreadcrumb.vue';
import AppSelect from '@/components/input/AppSelect.vue';
import IcEdit from '@/assets/svg/ic-edit.vue';
import IcTrash from '@/assets/svg/ic-trash.vue';
import IcPlus from '@/assets/svg/ic-plus.vue';
import {
  GET_BROADCAST_SETTINGS,
  DELETE_BROADCAST_SETTING,
  RUN_BROADCAST,
  GET_BROADCAST_LOGS,
  GET_BROADCAST_MEMBERS,
  DELETE_BROADCAST_MEMBER,
  PUT_BROADCAST_MEMBER,
} from '@/store/broadcast.module';
import FormBroadcastSetting from '@/components/modal/FormBroadcastSetting.vue';
import FormBroadcastRecipient from '@/components/modal/FormBroadcastRecipient.vue';
import type {
  ApiErrorResponse,
  BroadcastDeliveryStatus,
  BroadcastLogsResponse,
  BroadcastRecipient,
  BroadcastRecipientPayload,
  BroadcastRunResponse,
  BroadcastSetting,
} from '@/types/domain';

type BroadcastTab = 'settings' | 'recipients' | 'logs';

const store = useStore();

const activeTab = ref<BroadcastTab>('settings');

const modalOpen = ref(false);
const editingId = ref<number | undefined>(undefined);
const editingData = ref<Partial<BroadcastSetting>>({});
const addRecipientModalOpen = ref(false);
const editRecipientModalOpen = ref(false);
const editingRecipientId = ref<string | undefined>(undefined);
const savingRecipient = ref(false);
const recipientForm = ref<BroadcastRecipientPayload>({
  name: '',
  nim: '',
  noWhatsapp: '',
  email: '',
});

const loadingSettings = ref(true);
const loadingMembers = ref(false);
const loadingLogs = ref(false);
const blasting = ref<number | null>(null);

const logFilterId = ref('');
const logPage = ref(1);

const settings = computed<BroadcastSetting[]>(() => store.getters.broadcastSettings || []);
const logs = computed<BroadcastLogsResponse>(() => store.getters.broadcastLogs || { data: [], pagination: {} });
const members = computed<BroadcastRecipient[]>(() => store.getters.broadcastMembers || []);
const broadcastFilterOptions = computed(() => [
  { value: '', label: 'Semua Pengaturan' },
  ...settings.value.map((setting) => ({ value: setting.id, label: setting.name })),
]);

onMounted(async () => {
  await store.dispatch(GET_BROADCAST_SETTINGS);
  loadingSettings.value = false;
});

watch(activeTab, async (tab) => {
  if (tab === 'recipients' && !members.value.length) {
    loadingMembers.value = true;
    await store.dispatch(GET_BROADCAST_MEMBERS);
    loadingMembers.value = false;
  }
  if (tab === 'logs') {
    await loadLogs();
  }
});

const openAddRecipient = () => {
  addRecipientModalOpen.value = true;
};

const handleRecipientModalClose = async () => {
  addRecipientModalOpen.value = false;
  loadingMembers.value = true;
  await store.dispatch(GET_BROADCAST_MEMBERS);
  loadingMembers.value = false;
};

const deleteRecipient = async (id: string) => {
  const confirm = await Swal.fire({
    title: 'Hapus penerima ini?',
    text: 'Penerima tidak akan menerima broadcast lagi.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#8c8c94',
    cancelButtonText: 'Batal'
  });
  if (!confirm.isConfirmed) return;
  try {
    await store.dispatch(DELETE_BROADCAST_MEMBER, id);
    await store.dispatch(GET_BROADCAST_MEMBERS);
  } catch (err: unknown) {
    const apiError = err as ApiErrorResponse;
    Swal.fire({
      title: 'Error',
      text: apiError?.response?.data?.message || apiError?.message || 'Gagal menghapus.',
      icon: 'error',
      confirmButtonColor: '#003793'
    });
  }
};

const loadLogs = async () => {
  loadingLogs.value = true;
  const settingId = logFilterId.value ? Number(logFilterId.value) : undefined;
  await store.dispatch(GET_BROADCAST_LOGS, {
    settingId,
    page: logPage.value,
    limit: 20,
  });
  loadingLogs.value = false;
};

const openAdd = () => {
  editingId.value = undefined;
  editingData.value = {};
  modalOpen.value = true;
};

const openEdit = (s: BroadcastSetting) => {
  editingId.value = s.id;
  editingData.value = { ...s };
  modalOpen.value = true;
};

const openRecipientEdit = (recipient: BroadcastRecipient) => {
  editingRecipientId.value = recipient.id;
  recipientForm.value = {
    name: recipient.name || '',
    nim: recipient.nim || '',
    noWhatsapp: recipient.noWhatsapp || '',
    email: recipient.email || '',
  };
  editRecipientModalOpen.value = true;
};

const closeRecipientModal = () => {
  editRecipientModalOpen.value = false;
  editingRecipientId.value = undefined;
  savingRecipient.value = false;
  recipientForm.value = { name: '', nim: '', noWhatsapp: '', email: '' };
};

const saveRecipient = async () => {
  const errors: string[] = [];
  if (!recipientForm.value.name.trim()) errors.push('Nama penerima wajib diisi.');
  if (!recipientForm.value.noWhatsapp?.trim() && !recipientForm.value.email?.trim()) {
    errors.push('Minimal salah satu dari WhatsApp atau Email wajib diisi.');
  }

  if (recipientForm.value.email?.trim()) {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientForm.value.email.trim());
    if (!isEmailValid) errors.push('Format email tidak valid.');
  }

  if (errors.length) {
    Swal.fire({
      title: 'Validasi',
      html: errors.join('<br>'),
      icon: 'warning',
      confirmButtonColor: '#003793',
    });
    return;
  }

  if (!editingRecipientId.value) return;

  savingRecipient.value = true;
  try {
    await store.dispatch(PUT_BROADCAST_MEMBER, {
      id: editingRecipientId.value,
      data: {
        name: recipientForm.value.name.trim(),
        nim: recipientForm.value.nim?.trim() || null,
        noWhatsapp: recipientForm.value.noWhatsapp?.trim() || null,
        email: recipientForm.value.email?.trim() || null,
      },
    });
    await store.dispatch(GET_BROADCAST_MEMBERS);
    closeRecipientModal();
  } catch (err: unknown) {
    const apiError = err as ApiErrorResponse;
    Swal.fire({
      title: 'Error',
      text: apiError?.response?.data?.message || apiError?.message || 'Gagal menyimpan penerima.',
      icon: 'error',
      confirmButtonColor: '#003793',
    });
    savingRecipient.value = false;
  }
};

const handleModalClose = async () => {
  modalOpen.value = false;
  editingId.value = undefined;
  editingData.value = {};
  loadingSettings.value = true;
  await store.dispatch(GET_BROADCAST_SETTINGS);
  loadingSettings.value = false;
};

const runNow = async (id: number) => {
  const confirm = await Swal.fire({
    title: 'Blast sekarang?',
    text: 'Notifikasi akan dikirim ke semua penerima dalam setting ini.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, blast!',
    confirmButtonColor: '#003793',
    cancelButtonColor: '#8c8c94',
    cancelButtonText: 'Batal'
  });
  if (!confirm.isConfirmed) return;

  blasting.value = id;
  try {
    const result = await store.dispatch(RUN_BROADCAST, id) as BroadcastRunResponse;
    const runLogs = result?.logs || [];
    const waSent = runLogs.filter((log) => log.waStatus === 'sent').length;
    const waFailed = runLogs.filter((log) => log.waStatus === 'failed').length;
    const emailSent = runLogs.filter((log) => log.emailStatus === 'sent').length;
    const emailFailed = runLogs.filter((log) => log.emailStatus === 'failed').length;
    Swal.fire({
      title: waFailed || emailFailed ? 'Blast selesai dengan catatan' : 'Blast berhasil',
      html: `
        <div style="text-align:left;line-height:1.7">
          <div>WhatsApp terkirim: <strong>${waSent}</strong></div>
          <div>WhatsApp gagal: <strong>${waFailed}</strong></div>
          <div>Email terkirim: <strong>${emailSent}</strong></div>
          <div>Email gagal: <strong>${emailFailed}</strong></div>
        </div>
      `,
      icon: waFailed || emailFailed ? 'warning' : 'success',
      confirmButtonColor: '#003793',
    });
    await store.dispatch(GET_BROADCAST_SETTINGS);
  } catch (err: unknown) {
    const apiError = err as ApiErrorResponse;
    Swal.fire({
      title: 'Error', 
      text: apiError?.response?.data?.message || apiError?.message || 'Gagal mengirim broadcast.', 
      icon: 'error',
      confirmButtonColor: '#003793',
    });
  } finally {
    blasting.value = null;
  }
};

const deleteSetting = async (id: number) => {
  const confirm = await Swal.fire({
    title: 'Hapus pengaturan ini?',
    text: 'Jadwal yang dihapus tidak akan dikirimkan lagi.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#8c8c94',
    cancelButtonText: 'Batal'
  });
  if (!confirm.isConfirmed) return;
  try {
    await store.dispatch(DELETE_BROADCAST_SETTING, id);
    await store.dispatch(GET_BROADCAST_SETTINGS);
  } catch (err: unknown) {
    const apiError = err as ApiErrorResponse;
    Swal.fire({
      title: 'Error', 
      text: apiError?.response?.data?.message || apiError?.message || 'Gagal menghapus.', 
      icon: 'error',
      confirmButtonColor: '#003793',
    });
  }
};

const scheduleDayLabel = (s: BroadcastSetting) => {
  if (s.scheduleInterval === 'weekly') {
    const days = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    return days[s.scheduleDay] || s.scheduleDay;
  }
  return `Tanggal ${s.scheduleDay}`;
};

const formatDate = (d?: string | null) => {
  if (!d) return '-';
  return new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
};

const statusClass = (status: BroadcastDeliveryStatus | string) => {
  if (status === 'sent') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'failed') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-50 text-slate-500 border-slate-200';
};
</script>
