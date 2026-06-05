import type { Phone } from "@/lib/types";

// Зурагтай бол <img>, үгүй бол брэндийн эхний үсэгтэй neon placeholder.
// (next/image-ийн оронд энгийн <img> — Supabase Storage URL-д домэйн тохиргоо шаардахгүй.)
export function PhoneImage({
  phone,
  className,
}: {
  phone: Phone;
  className?: string;
}) {
  if (phone.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={phone.image_url}
        alt={`${phone.brand} ${phone.model}`}
        className={className}
      />
    );
  }
  return (
    <div
      className={`grid place-items-center bg-gradient-to-br from-surface-2 to-surface ${className ?? ""}`}
    >
      <span className="text-4xl font-bold text-muted/40">
        {phone.brand.charAt(0)}
      </span>
    </div>
  );
}
