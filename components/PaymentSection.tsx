import type { PaymentMethod } from "@/lib/types";
import { loanNotices } from "@/lib/calc";
import { SplitCalculator } from "./SplitCalculator";

/** Дэлгэрэнгүй хуудасны төлбөрийн бүх боломж: split тооцоолуур + loan мэдэгдэл. */
export function PaymentSection({
  price,
  methods,
}: {
  price: number;
  methods: PaymentMethod[];
}) {
  const loans = loanNotices(methods);

  return (
    <div className="space-y-6">
      <SplitCalculator price={price} methods={methods} />

      {loans.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Цахим зээлээр</h2>
          {loans.map(({ method }) => (
            <div
              key={method.id}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <span className="font-medium">{method.name}</span>
              <p className="mt-1 text-sm text-muted">
                {method.name}-ээр авах боломжтой. Эцсийн нөхцөл (хүү, хугацаа)
                таны зээлийн эрхээс хамаарч аппад тогтоно.
              </p>
            </div>
          ))}
        </section>
      )}

      <p className="border-t border-border pt-3 text-xs text-muted">
        Үнэ, нөхцөл өөрчлөгдөж болзошгүй. Эцсийн дүнг тухайн аппд баталгаажуулна
        уу.
      </p>
    </div>
  );
}
