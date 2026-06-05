import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Олдсонгүй</h1>
      <p className="mt-2 text-muted">
        Энэ утас байхгүй эсвэл аль хэдийн зарагдсан байна.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-accent px-4 py-2 font-medium text-accent-foreground"
      >
        Нүүр хуудас
      </Link>
    </div>
  );
}
