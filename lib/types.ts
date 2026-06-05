// Сансар гар утас худалдаа — өгөгдлийн төрлүүд (Supabase хүснэгтүүдтэй тохирно)

export type PhoneCondition = "new" | "used";
export type PhoneStatus = "available" | "sold";
export type PaymentType = "split" | "loan";

/** phones хүснэгт */
export interface Phone {
  id: string;
  brand: string;
  model: string;
  storage: string | null;
  color: string | null;
  condition: PhoneCondition;
  price: number; // бэлэн үнэ ₮
  image_url: string | null;
  description: string | null;
  status: PhoneStatus;
  created_at: string; // ISO
}

/** payment_methods хүснэгт */
export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentType;
  max_installments: number | null; // зөвхөн split-д
  min_amount: number | null; // энэ дүнгээс дээш бол хамаарна
  note: string | null;
  logo_url: string | null;
  sort_order: number;
  is_active: boolean;
}

/** settings — key/value */
export type Settings = Record<string, string>;

// ===== Тооцоолсон (computed) төрлүүд =====

/** split аппын нэг хуваан төлөлтийн сонголт */
export interface SplitOption {
  months: number; // хэдэн сар (N = 2..max)
  monthly: number; // сарын төлбөр = ceil(price / months)
  total: number; // нийт = бэлэн үнэ (хүүгүй)
}

/** нэг split аппын бүх сонголт */
export interface SplitPlan {
  method: PaymentMethod;
  options: SplitOption[]; // months өсөхөөр эрэмбэлэгдсэн
}

/** loan апп — зөвхөн мэдэгдэл, ямар ч дүн тооцохгүй */
export interface LoanNotice {
  method: PaymentMethod;
}

/** утасны бүх төлбөрийн боломж */
export interface PhonePayments {
  splits: SplitPlan[];
  loans: LoanNotice[];
}
