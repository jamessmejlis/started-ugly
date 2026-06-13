import type { Metadata } from "next";
import Link from "next/link";
import { SubmitForm } from "@/components/SubmitForm";
import { repoUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit your ugly MVP",
  description:
    "Get your embarrassing first version featured next to Airbnb's. Shipping ugly is the whole point.",
};

export default function SubmitPage() {
  return (
    <main>
      <p>
        <Link href="/">← All ugly MVPs</Link>
      </p>
      <h1>Submit your ugly MVP</h1>
      <p>
        Shipped something ugly to real users? Get it featured next to Airbnb&apos;s cereal boxes.
        I&apos;ll personally reply within a couple of days to grab your screenshot.
      </p>
      <SubmitForm />
      {repoUrl && (
        <>
          <h2>Prefer GitHub?</h2>
          <p>
            Add yourself directly: open an issue with the{" "}
            <a href={`${repoUrl}/issues/new/choose`}>Submit your ugly MVP template</a>, or send a PR
            — see <a href={`${repoUrl}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a>.
          </p>
        </>
      )}
    </main>
  );
}
