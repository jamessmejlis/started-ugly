const embedUrl = process.env.NEXT_PUBLIC_BEEHIIV_EMBED_URL;

export function NewsletterEmbed() {
  if (!embedUrl) return null; // renders nothing until beehiiv is configured
  return (
    <section className="newsletter">
      <h2>Get the story behind the next ugly MVP</h2>
      <iframe src={embedUrl} title="Newsletter signup" width="100%" height="120" />
    </section>
  );
}
