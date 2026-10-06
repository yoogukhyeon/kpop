/** Renders schema.org structured data. `<` is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** schema.org BreadcrumbList from [name, absolute URL] pairs, home first. */
export function BreadcrumbJsonLd({ items }: { items: [string, string][] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })),
      }}
    />
  );
}
