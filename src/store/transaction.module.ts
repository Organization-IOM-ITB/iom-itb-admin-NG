import ApiService from "./api.service";
import { ActionContext } from "vuex";
import type {
    ApiActionParams,
    ApiDataResponse,
    PaginatedData,
    PaginationMeta,
    RootState,
    Transaction,
} from "@/types/domain";

export type { Transaction } from "@/types/domain";

export const GET_TRANSACTIONS = "getTransactions";
export const SET_TRANSACTIONS = "setTransactions";
export const POST_TRANSACTION = "postTransaction";
export const PUT_TRANSACTION = "putTransaction";
export const CONFIRM_TRANSACTION_PAYMENT = "confirmTransactionPayment";
export const DELETE_TRANSACTION = "deleteTransaction";
export const EXPORT_TRANSACTIONS = "exportTransactions";

// summary: total lintas halaman dengan filter yang sama (api-NG GetTransactions).
export interface TransactionSummary {
    settledCount?: number;
    needProcessCount?: number;
}

type TransactionListResponse = PaginatedData<Transaction> & { summary?: TransactionSummary };

// Ukuran halaman saat export: cukup besar agar sedikit request, cukup kecil
// agar satu response tetap ringan. Batas halaman mencegah loop tanpa akhir
// kalau API mengembalikan pagination yang tidak konsisten.
const EXPORT_PAGE_SIZE = 200;
const EXPORT_MAX_PAGES = 500;

// Define type for state
interface State {
    transactions: Transaction[];
    transactionPagination: PaginationMeta;
    transactionSummary: TransactionSummary;
}

// Define initial state
const state: State = {
    transactions: [],
    transactionPagination: {},
    transactionSummary: {},
};

// Define getters
const getters = {
    transactions(state: State): Transaction[] {
        return state.transactions; // Return transaction data
    },
    transactionPagination(state: State): PaginationMeta {
        return state.transactionPagination;
    },
    transactionSummary(state: State): TransactionSummary {
        return state.transactionSummary;
    },
};

// Define VuexContext type
type VuexContext = ActionContext<State, RootState>;

const actions = {
    [GET_TRANSACTIONS](context: VuexContext, params: ApiActionParams = {}): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            ApiService.get<TransactionListResponse>("/transactions", params.data || {})
                .then(response => {
                    context.commit(SET_TRANSACTIONS, response);
                    resolve(response.data || []);
                })
                .catch(err => {
                    console.error("Error fetching transactions:", err);
                    reject(err);
                });
        });
    },
    // Ambil SEMUA transaksi yang cocok dengan filter, lintas halaman, tanpa
    // commit ke state — tabel yang sedang tampil tidak ikut berubah.
    async [EXPORT_TRANSACTIONS](_context: VuexContext, params: ApiActionParams = {}): Promise<Transaction[]> {
        const filters = { ...(params.data || {}) } as Record<string, unknown>;
        const rows: Transaction[] = [];

        for (let page = 1; page <= EXPORT_MAX_PAGES; page += 1) {
            const response = await ApiService.get<TransactionListResponse>("/transactions", {
                ...filters,
                page,
                limit: EXPORT_PAGE_SIZE,
            });
            const batch = response.data || [];
            rows.push(...batch);

            const totalPages = response.pagination?.totalPages || 1;
            if (batch.length < EXPORT_PAGE_SIZE || page >= totalPages) break;
        }

        return rows;
    },
    [POST_TRANSACTION](context: VuexContext, params: ApiActionParams<Partial<Transaction>>): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            ApiService.post<ApiDataResponse<Transaction[]>>("/transactions", params.data || {})
                .then(({ data }) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    [PUT_TRANSACTION](context: VuexContext, params: ApiActionParams<Partial<Transaction>>): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            ApiService.put<ApiDataResponse<Transaction[]>>(`/transactions/${params.id}`, params.data || {})
                .then(({ data }) => resolve(data))
                .catch((err) => {
                    reject(err);
                });
        });
    },
    [CONFIRM_TRANSACTION_PAYMENT](context: VuexContext, params: ApiActionParams): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            ApiService.post<ApiDataResponse<Transaction[]>>(`/transactions/${params.id}/confirm-payment`, {})
                .then(({ data }) => resolve(data))
                .catch((err) => {
                    reject(err);
                });
        });
    },
    [DELETE_TRANSACTION](context: VuexContext, params: ApiActionParams): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.delete(`/transactions/${params.id}`)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};

const mutations = {
    [SET_TRANSACTIONS](state: State, response: TransactionListResponse | Transaction[]): void {
        if (Array.isArray(response)) {
            state.transactions = response;
            state.transactionPagination = {};
            state.transactionSummary = {};
            return;
        }

        state.transactions = response.data || [];
        state.transactionPagination = response.pagination || {};
        state.transactionSummary = response.summary || {};
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
