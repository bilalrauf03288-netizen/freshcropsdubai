const approvedClientNames = [
  "Doner Deli",
  "Belly Bump Restaurant LLC",
  "Humyum Restaurant LLC",
  "Panadero Pastry",
  "New Marina Restaurant LLC",
  "Palate of Spices Restaurant",
 ] as const;

const excludedAccountTerms = ["cash in hand", "bank account", "cash customer"];

const verifiedFoodClients = approvedClientNames.filter((name) =>
  excludedAccountTerms.every((term) => !name.toLowerCase().includes(term)),
);

function ClientCard({ name, duplicate = false }: { name: string; duplicate?: boolean }) {
  const initials = name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("");

  return <article className="clientCard" aria-hidden={duplicate || undefined}>
    <div className="clientMonogram" aria-hidden="true">{initials}</div>
    <div className="clientCardContent">
      <div className="clientStars" role="img" aria-label="5 out of 5 stars"><span aria-hidden="true">★★★★★</span></div>
      <h3>{name}</h3>
      <p><span aria-hidden="true">✓</span> Verified Business Client</p>
    </div>
  </article>;
}

export function BusinessClients() {
  return <section className="businessClients" aria-labelledby="business-clients-title">
    <div className="sectionIntro"><p className="eyebrow">Verified client trust</p><h2 id="business-clients-title">Trusted by UAE food businesses.</h2><p>Restaurants, bakeries and food-service teams that choose FreshCrops for dependable supply.</p></div>
    <div className="clientMarquee" tabIndex={0} aria-label="Verified FreshCrops business clients. Animation pauses on hover or keyboard focus.">
      <div className="clientTrack">
        <div className="clientGroup">{verifiedFoodClients.map((name) => <ClientCard name={name} key={name} />)}</div>
        <div className="clientGroup clientGroupDuplicate" aria-hidden="true">{verifiedFoodClients.map((name) => <ClientCard name={name} duplicate key={`duplicate-${name}`} />)}</div>
      </div>
    </div>
    <p className="reviewNotice">Only approved restaurant, bakery and food-service client records are shown.</p>
  </section>;
}
