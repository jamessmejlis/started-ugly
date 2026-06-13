import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>This page doesn&apos;t exist — unlike your MVP, which should.</p>
      <p>
        <Link href="/">← All ugly MVPs</Link> · <Link href="/submit">Submit your ugly MVP</Link>
      </p>
    </main>
  );
}
