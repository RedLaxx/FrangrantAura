import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-5 font-display text-5xl text-white sm:text-6xl">
        This scent doesn&apos;t exist
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-300">
        The page you were looking for may have been renamed or removed. Let's
        get you back to the collection.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/shop" className="btn-primary">
          Shop fragrances
        </Link>
        <Link href="/" className="btn-secondary">
          Back home
        </Link>
      </div>
    </div>
  );
}
