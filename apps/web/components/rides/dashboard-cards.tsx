const cards = [
  { title: "Passenger flow", value: "Request", copy: "Choose date, time, duration, ride type, motorcycle, and preferred rider." },
  { title: "Rider flow", value: "Accept", copy: "Approved riders review scheduled requests and manually accept." },
  { title: "Admin flow", value: "Approve", copy: "Administrators approve riders, motorcycles, waivers, documents, and incidents." }
];

export function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article key={card.title} className="rr-card rounded-3xl p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-rr-purple">{card.title}</div>
          <div className="rr-metal-text mt-4 text-4xl font-black">{card.value}</div>
          <p className="mt-4 text-sm leading-6 text-rr-chrome">{card.copy}</p>
        </article>
      ))}
    </div>
  );
}
