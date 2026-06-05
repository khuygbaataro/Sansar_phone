// Сансар гар утас худалдаа — төлбөрийн тооцооллын логик (хамгийн чухал хэсэг)
//
// Дүрэм:
//   • split (хүүгүй: Storepay, M Credit) → сар = ceil(price / N), НИЙТ = price.
//   • loan  (хүүтэй: Pocket, LendMN)     → ЯМАР Ч дүн тооцохгүй, зохиохгүй.
//
// Энэ файл клиент талд ч ажиллах ёстой тул сервер-only зүйл импортлохгүй.

import type {
  PaymentMethod,
  SplitOption,
  SplitPlan,
  LoanNotice,
  PhonePayments,
} from "./types";

/** Үнийг монгол ₮ форматаар: 1890000 → "1,890,000₮" */
export function formatTugrik(amount: number): string {
  const n = Math.round(amount);
  const grouped = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (n < 0 ? "-" : "") + grouped + "₮";
}

/**
 * split аппын хуваан төлөлтийн сонголтууд (N = 2 … max_installments).
 * Сарын төлбөр = ceil(price / N). Нийт = price (хүү, нэмэгдэлгүй).
 * type ≠ split, эсвэл price < min_amount бол хоосон жагсаалт буцаана.
 */
export function computeSplitOptions(
  price: number,
  method: PaymentMethod,
): SplitOption[] {
  if (method.type !== "split") return [];
  const max = method.max_installments ?? 0;
  if (max < 2) return [];
  if (method.min_amount != null && price < method.min_amount) return [];

  const options: SplitOption[] = [];
  for (let months = 2; months <= max; months++) {
    options.push({ months, monthly: Math.ceil(price / months), total: price });
  }
  return options;
}

/** Идэвхтэй split аппууд тус бүрийн боломжит хуваан төлөлт (хоосныг хасна). */
export function splitPlans(
  price: number,
  methods: PaymentMethod[],
): SplitPlan[] {
  return methods
    .filter((m) => m.type === "split" && m.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((method) => ({ method, options: computeSplitOptions(price, method) }))
    .filter((plan) => plan.options.length > 0);
}

/** Идэвхтэй loan аппуудын мэдэгдэл (дүн тооцохгүй). */
export function loanNotices(methods: PaymentMethod[]): LoanNotice[] {
  return methods
    .filter((m) => m.type === "loan" && m.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((method) => ({ method }));
}

/** Утасны бүх төлбөрийн боломж (split + loan). */
export function phonePayments(
  price: number,
  methods: PaymentMethod[],
): PhonePayments {
  return {
    splits: splitPlans(price, methods),
    loans: loanNotices(methods),
  };
}

/**
 * Каталогийн картад highlight хийх хамгийн таатай сонголт:
 * хамгийн их N (тиймээс хамгийн бага сарын төлбөр)-тэй split апп.
 * Боломжгүй бол null.
 */
export function bestSplitHighlight(
  price: number,
  methods: PaymentMethod[],
): { method: PaymentMethod; option: SplitOption } | null {
  let best: { method: PaymentMethod; option: SplitOption } | null = null;
  for (const plan of splitPlans(price, methods)) {
    const maxOption = plan.options[plan.options.length - 1]; // хамгийн их N
    if (!best || maxOption.monthly < best.option.monthly) {
      best = { method: plan.method, option: maxOption };
    }
  }
  return best;
}
