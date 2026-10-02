import ApiService from './api.service'
import type { Module } from 'vuex'

// Konfirmasi transfer yang dikirim donatur lewat form Tally DONASI (mZJe8e).
// Terpisah dari donasi.module (tabel Donations): baris di sini belum
// diverifikasi bendahara dan belum tentu tercatat sebagai donasi.

export const GET_DONASI_TALLY = 'GET_DONASI_TALLY'

export interface DonasiTallySubmission {
  id: number
  tallySubmissionId: string
  submittedAt: string
  payload: { answersByLabel: Record<string, string | null>; [key: string]: unknown }
  extractedWhatsapp: string | null
  sourceType: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalEntries: number
  perPage: number
  start: number
  end: number
}

interface ListResponse {
  data?: DonasiTallySubmission[]
  pagination: { currentPage: number; totalPages: number; totalEntries: number; perPage: number }
}

interface ApiError {
  message?: string
  response?: { data?: { message?: string } }
}

interface State {
  list: DonasiTallySubmission[]
  pagination: Pagination
  loading: boolean
  error: string | null
}

const SET_LIST = 'SET_LIST'
const SET_PAGINATION = 'SET_PAGINATION'
const SET_LOADING = 'SET_LOADING'
const SET_ERROR = 'SET_ERROR'

const emptyPagination = (): Pagination => ({
  currentPage: 1, totalPages: 1, totalEntries: 0, perPage: 10, start: 0, end: 0,
})

const donasiTallyModule: Module<State, unknown> = {
  namespaced: true,

  state: (): State => ({
    list: [],
    pagination: emptyPagination(),
    loading: false,
    error: null,
  }),

  getters: {
    list: (s) => s.list,
    pagination: (s) => s.pagination,
    loading: (s) => s.loading,
    error: (s) => s.error,
  },

  mutations: {
    [SET_LIST](state, payload: DonasiTallySubmission[]) { state.list = payload },
    [SET_PAGINATION](state, payload: Pagination) { state.pagination = payload },
    [SET_LOADING](state, val: boolean) { state.loading = val },
    [SET_ERROR](state, msg: string | null) { state.error = msg },
  },

  actions: {
    async [GET_DONASI_TALLY](
      { commit },
      params: { search?: string; limit?: number; page?: number; sortOrder?: string } = {},
    ) {
      commit(SET_LOADING, true)
      commit(SET_ERROR, null)
      try {
        const res = await ApiService.get<ListResponse>('/tally-submissions/form/donasi', params)
        const { data, pagination } = res
        const p = pagination.currentPage
        const lim = pagination.perPage
        const total = pagination.totalEntries
        commit(SET_LIST, data ?? [])
        commit(SET_PAGINATION, {
          currentPage: p,
          totalPages: pagination.totalPages || 1,
          totalEntries: total,
          perPage: lim,
          start: total === 0 ? 0 : (p - 1) * lim + 1,
          end: Math.min(p * lim, total),
        })
      } catch (error) {
        const err = error as ApiError
        commit(SET_LIST, [])
        commit(SET_PAGINATION, emptyPagination())
        commit(SET_ERROR, err?.response?.data?.message ?? err?.message ?? 'Gagal memuat data')
      } finally {
        commit(SET_LOADING, false)
      }
    },
  },
}

export default donasiTallyModule
