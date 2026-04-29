const features = [
  {
    title: "Verified inventory",
    body: "Each listing is anchored by category, stock status, and price, so the decision happens before the click instead of after it.",
  },
  {
    title: "Security without theater",
    body: "Buyers still get safe checkout and account controls, but the interface stops shouting about it and lets the products hold the page.",
  },
  {
    title: "Responsive by default",
    body: "The layout collapses cleanly from large editorial headers on desktop to edge-led mobile typography without losing hierarchy or touch target size.",
  },
];

export const HomeBuyerFeatures = () => {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <div className="content-container grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-5">
          <p className="section-label">What buyers get</p>
          <h2 className="text-display-lg uppercase">
            A catalog with better contrast and clearer decisions.
          </h2>
        </div>
        <div className="space-y-8">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="grid gap-4 border-t border-border pt-6 md:grid-cols-[72px_minmax(0,1fr)]"
            >
              <p className="font-display text-4xl tracking-[-0.06em] text-accent">{`0${index + 1}`}</p>
              <div>
                <h3 className="text-2xl uppercase tracking-[-0.04em]">{feature.title}</h3>
                <p className="mt-3 max-w-2xl text-body text-muted-foreground">{feature.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
