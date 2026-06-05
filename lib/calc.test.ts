import { describe, it, expect } from "vitest";
import {
  formatTugrik,
  computeSplitOptions,
  splitPlans,
  loanNotices,
  phonePayments,
  bestSplitHighlight,
} from "./calc";
import type { PaymentMethod } from "./types";

const storepay: PaymentMethod = {
  id: "m1", name: "Storepay", type: "split",
  max_installments: 6, min_amount: 100000,
  note: null, logo_url: null, sort_order: 1, is_active: true,
};
const mcredit: PaymentMethod = {
  id: "m2", name: "M Credit", type: "split",
  max_installments: 4, min_amount: null,
  note: null, logo_url: null, sort_order: 2, is_active: true,
};
const pocket: PaymentMethod = {
  id: "m3", name: "Pocket", type: "loan",
  max_installments: null, min_amount: null,
  note: null, logo_url: null, sort_order: 3, is_active: true,
};
const lendmn: PaymentMethod = {
  id: "m4", name: "LendMN", type: "loan",
  max_installments: null, min_amount: null,
  note: null, logo_url: null, sort_order: 4, is_active: true,
};

describe("formatTugrik", () => {
  it("мянгатын тусгаарлагч + ₮", () => {
    expect(formatTugrik(1890000)).toBe("1,890,000₮");
    expect(formatTugrik(315000)).toBe("315,000₮");
    expect(formatTugrik(1000)).toBe("1,000₮");
    expect(formatTugrik(999)).toBe("999₮");
    expect(formatTugrik(0)).toBe("0₮");
  });
});

describe("computeSplitOptions — split (хүүгүй)", () => {
  it("Storepay: N=2..6, monthly=ceil, нийт=price", () => {
    const opts = computeSplitOptions(1890000, storepay);
    expect(opts.map((o) => o.months)).toEqual([2, 3, 4, 5, 6]);
    expect(opts.find((o) => o.months === 6)!.monthly).toBe(315000);
    expect(opts.find((o) => o.months === 2)!.monthly).toBe(945000);
    // Хамгийн чухал шалгуур: нийт = бэлэн үнэ
    expect(opts.every((o) => o.total === 1890000)).toBe(true);
  });

  it("ceil дээш бүхэлчилнэ", () => {
    const opts = computeSplitOptions(1000000, storepay); // 1000000/3 = 333333.33
    expect(opts.find((o) => o.months === 3)!.monthly).toBe(333334);
  });

  it("min_amount-аас доош → хоосон", () => {
    expect(computeSplitOptions(50000, storepay)).toEqual([]);
  });

  it("M Credit (min байхгүй): N=2..4", () => {
    const opts = computeSplitOptions(80000, mcredit);
    expect(opts.map((o) => o.months)).toEqual([2, 3, 4]);
  });

  it("loan апп → хоосон (дүн тооцохгүй)", () => {
    expect(computeSplitOptions(1000000, pocket)).toEqual([]);
  });
});

describe("splitPlans / loanNotices / phonePayments", () => {
  const methods = [storepay, mcredit, pocket, lendmn];

  it("splitPlans: зөвхөн split, sort_order-оор", () => {
    expect(splitPlans(1890000, methods).map((p) => p.method.name)).toEqual([
      "Storepay",
      "M Credit",
    ]);
  });

  it("loanNotices: зөвхөн loan, дүнгүй", () => {
    const loans = loanNotices(methods);
    expect(loans.map((l) => l.method.name)).toEqual(["Pocket", "LendMN"]);
    expect(Object.keys(loans[0])).toEqual(["method"]); // дүн талбар алга
  });

  it("phonePayments: split + loan нэгтгэнэ", () => {
    const pp = phonePayments(1890000, methods);
    expect(pp.splits.length).toBe(2);
    expect(pp.loans.length).toBe(2);
  });

  it("идэвхгүй аргыг хасна", () => {
    const plans = splitPlans(1890000, [
      { ...storepay, is_active: false },
      mcredit,
    ]);
    expect(plans.map((p) => p.method.name)).toEqual(["M Credit"]);
  });
});

describe("bestSplitHighlight", () => {
  it("хамгийн бага сарын төлбөртэйг сонгоно (хамгийн их N)", () => {
    const best = bestSplitHighlight(1890000, [storepay, mcredit])!;
    expect(best.method.name).toBe("Storepay"); // 315,000 < M Credit 472,500
    expect(best.option.months).toBe(6);
    expect(best.option.monthly).toBe(315000);
  });

  it("боломжгүй бол null", () => {
    expect(bestSplitHighlight(50000, [storepay])).toBeNull(); // min-аас доош
    expect(bestSplitHighlight(1000000, [pocket, lendmn])).toBeNull(); // зөвхөн loan
  });
});
