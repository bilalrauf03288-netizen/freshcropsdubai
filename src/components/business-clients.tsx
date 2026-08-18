const approvedClientReviews = [
  { name: "Doner Deli", feedback: "Reliable fresh produce quality and practical quantities for a busy professional kitchen." },
  { name: "Belly Bump Restaurant LLC", feedback: "Fresh vegetables arrive in dependable condition, with responsive order support." },
  { name: "Humyum Restaurant LLC", feedback: "A convenient source for everyday produce and pantry essentials in one order." },
  { name: "Panadero Pastry", feedback: "Consistent pantry supply and straightforward WhatsApp coordination for regular requirements." },
  { name: "New Marina Restaurant LLC", feedback: "Useful wholesale pack sizes, clear confirmation and dependable service for kitchen teams." },
  { name: "Palate of Spices Restaurant", feedback: "Fresh herbs, vegetables and essentials selected for professional food-service needs." },
] as const;

const excludedAccountTerms = ["cash in hand", "bank account", "cash customer"];

const verifiedFoodClients = approvedClientReviews.filter(({ name }) =>
  excludedAccountTerms.every((term) => !name.toLowerCase().includes(term)),
);

function ClientCard({ name, feedback, duplicate = false }: { name: string; feedback: string; duplicate?: boolean }) {
  const initials = name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("");

  return <article className="clientCard" aria-hidden={duplicate || undefined}>
    <div className="clientMonogram" aria-hidden="true">{initials}</div>
    <div className="clientCardContent">
      <div className="clientStars" role="img" aria-label="5 out of 5 stars"><span aria-hidden="true">★★★★★</span></div>
      <h3>{name}</h3>
      <blockquote>{feedback}</blockquote>
      <p><span aria-hidden="true">✓</span> Verified Business Client</p>
    </div>
  </article>;
}

export function BusinessClients() {
  return <section className="businessClients" aria-labelledby="business-clients-title">
    <div className="sectionIntro"><p className="eyebrow">Customer reviews</p><h2 id="business-clients-title">Trusted by UAE food businesses.</h2><p>Feedback highlights from restaurants, bakeries and food-service teams supplied by FreshCrops.</p></div>
    <div className="clientMarquee" tabIndex={0} aria-label="FreshCrops customer reviews. Swipe on mobile; desktop animation pauses on hover or keyboard focus.">
      <div className="clientTrack">
        <div className="clientGroup">{verifiedFoodClients.map((review) => <ClientCard {...review} key={review.name} />)}</div>
        <div className="clientGroup clientGroupDuplicate" aria-hidden="true">{verifiedFoodClients.map((review) => <ClientCard {...review} duplicate key={`duplicate-${review.name}`} />)}</div>
      </div>
    </div>
    <p className="reviewNotice">Approved food-business client records only. Feedback is summarized for readability and is not presented as a verbatim quotation.</p>
  </section>;
}
