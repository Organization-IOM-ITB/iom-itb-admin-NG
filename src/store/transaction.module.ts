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

type TransactionListResponse = PaginatedData<Transaction>;

// Define type for state
interface State {
    transactions: Transaction[];
    transactionPagination: PaginationMeta;
}

// Define initial state
const state: State = {
    transactions: [],
    transactionPagination: {},
};

// Define getters
const getters = {
    transactions(state: State): Transaction[] {
        return state.transactions; // Return transaction data
    },
    transactionPagination(state: State): PaginationMeta {
        return state.transactionPagination;
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
            return;
        }

        state.transactions = response.data || [];
        state.transactionPagination = response.pagination || {};
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
