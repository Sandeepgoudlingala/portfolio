import Link from "next/link";

export const dynamic = "force-static";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
        404 — Not Found
      </p>
      <h1 className="text-4xl sm:text-6xl font-black font-archivo tracking-tight uppercase mb-4">
        Altitude Zero
      </h1>
      <p className="text-sm font-archivo text-muted max-w-md mb-8">
        The coordinate you are looking for does not exist or has fallen beyond the event horizon.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all"
      >
        Return to Surface
      </Link>
    </div>
  );
}
