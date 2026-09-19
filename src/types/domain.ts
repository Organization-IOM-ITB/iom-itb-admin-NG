export type EntityId = string | number;
export type RootState = Record<string, unknown>;
export type ApiPrimitive = string | number | boolean | null | undefined;
export type ApiQueryParams = Record<string, ApiPrimitive>;
export type ApiPayload = Record<string, unknown> | FormData;

export interface ApiActionParams<TData = ApiPayload> {
  id?: EntityId;
  data?: TData;
}

export interface ApiDataResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface PaginationMeta {
  currentPage?: number;
  totalPages?: number;
  start?: number;
  end?: number;
  totalEntries?: number;
  totalItems?: number;
  perPage?: number;
}

export interface PaginatedData<T> {
  data: T[];
  pagination?: PaginationMeta;
}

export type PaymentMethod = "manual" | "midtrans";
export type PaymentStatus = "pending" | "settlement" | "expired" | "failed" | "refunded";
export type DonationType =
  | "iuran_sukarela"
  | "kontribusi_anggota"
  | "kontribusi_donatur"
  | "pembelian_merchandise"
  | "kontribusi_sukarela";
export type NotificationChannel = "whatsapp" | "email";

export interface Fakultas {
  id: number;
  name: string;
  kodeUnik: string;
  isActive: boolean;
}

export type FakultasPayload = Omit<Fakultas, "id">;

export interface DonationOptions {
  nameIsHidden?: boolean;
  isHambaAllah?: boolean;
}

export interface Donation {
  id?: EntityId;
  name?: string;
  email?: string;
  noWhatsapp?: string;
  amount?: number | string | null;
  grossAmount?: number | string | null;
  donationType?: DonationType | string;
  facultyId?: number | null;
  faculty?: Pick<Fakultas, "id" | "name" | "kodeUnik"> | null;
  kodeUnik?: string | null;
  paymentMethod?: PaymentMethod | string;
  paymentStatus?: PaymentStatus | string;
  proof?: string;
  date?: string;
  bank?: string;
  notification?: NotificationChannel[] | string[];
  options?: DonationOptions;
  nameIsHidden?: boolean;
  isHambaAllah?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type DonationPayload = Partial<Donation> & {
  image?: string | File | null;
};

export interface Kemitraan {
  id?: EntityId;
  name?: string;
  picName?: string;
  picPhone?: string;
  type?: string;
  description?: string;
  logo?: string;
  image?: string;
  file?: string;
  mou?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  options?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export type KemitraanPayload = Partial<Kemitraan> | FormData;

export type KegiatanKemitraanStatus = "planned" | "ongoing" | "completed" | "cancelled";

export interface KegiatanKemitraan {
  id?: EntityId;
  kemitraanId?: number;
  kemitraan?: Kemitraan;
  name?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  file?: string;
  status?: KegiatanKemitraanStatus | string;
  options?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export type KegiatanKemitraanPayload = Partial<KegiatanKemitraan> | FormData;

export interface Merchandise {
  id?: number;
  title?: string;
  name?: string;
  stock?: number | string | null;
  price?: number | string | null;
  hpp?: number | string | null;
  description?: string;
  image?: string | File | null;
  link?: string;
  kategori?: string;
  totalTerjual?: number;
  totalPendapatan?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type MerchandisePayload = Partial<Merchandise> & Record<string, unknown>;

export type OrderStatus =
  | "waiting"
  | "on process"
  | "on delivery"
  | "arrived"
  | "done"
  | "canceled"
  | "denied";

export interface Transaction {
  id: number;
  code?: string;
  publicToken?: string;
  username?: string;
  email?: string;
  noTelp?: string;
  address?: string;
  merchandiseId?: number;
  merchandises?: Merchandise;
  qty?: number;
  payment?: string | null;
  paymentMethod?: PaymentMethod | string;
  paymentStatus?: PaymentStatus | string;
  grossAmount?: number | string | null;
  midtransOrderId?: string | null;
  midtransTransactionId?: string | null;
  paymentType?: string | null;
  status: OrderStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentDashboardKpis {
  totalAmount?: number | string;
  totalCount?: number;
  settledAmount?: number | string;
  settledCount?: number;
  pendingAmount?: number | string;
  pendingCount?: number;
  failedCount?: number;
  expiredCount?: number;
  settlementRate?: number;
}

export interface PaymentSummaryItem {
  status?: string;
  type?: string;
  method?: string;
  facultyName?: string;
  donationType?: string;
  date?: string;
  count?: number | string;
  totalAmount?: number | string;
  [key: string]: string | number | undefined;
}

export interface PaymentDashboardData {
  kpis?: PaymentDashboardKpis;
  statusSummary?: PaymentSummaryItem[];
  typeSummary?: PaymentSummaryItem[];
  methodSummary?: PaymentSummaryItem[];
  facultySummary?: PaymentSummaryItem[];
  dailyTrend?: PaymentSummaryItem[];
  recentPayments?: PaymentSummaryItem[];
}

export type BroadcastScheduleInterval = "weekly" | "monthly" | "3months";
export type BroadcastDeliveryStatus = "sent" | "failed" | "skipped";

export interface BroadcastRecipient {
  id: string;
  name: string;
  noWhatsapp: string | null;
  email: string | null;
  nim?: string | null;
}

export interface BroadcastSetting {
  id: number;
  name: string;
  scheduleDay: number;
  scheduleInterval: BroadcastScheduleInterval;
  jenisIuran: string;
  template: string;
  recipients: BroadcastRecipient[];
  isActive: boolean;
  lastRunAt: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type BroadcastSettingPayload = Pick<
  BroadcastSetting,
  "name" | "scheduleDay" | "scheduleInterval" | "jenisIuran" | "template" | "isActive"
> & {
  recipients?: BroadcastRecipient[];
};

export type BroadcastRecipientPayload = Pick<BroadcastRecipient, "name" | "nim" | "noWhatsapp" | "email">;

export interface BroadcastLog {
  id: number;
  broadcastSettingId: number;
  broadcastName: string;
  recipientName: string | null;
  waNumber: string | null;
  email: string | null;
  waStatus: BroadcastDeliveryStatus;
  emailStatus: BroadcastDeliveryStatus;
  waError: string | null;
  emailError: string | null;
  sentAt: string | null;
}

export interface BroadcastLogsResponse {
  data: BroadcastLog[];
  pagination: {
    total?: number;
    page?: number;
    totalPages?: number;
    limit?: number;
  };
}

export interface BroadcastRunResponse {
  sent: number;
  attempted: number;
  logs: BroadcastLog[];
}
