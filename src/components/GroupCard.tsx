import Link from "next/link";
import { Cover } from "@/components/Cover";
import type { Group } from "@/lib/types";

/** Product-style card: cover image on top, name and facts below. */
export function GroupCard({ group, locale, membersLabel }: { group: Group; locale: string; membersLabel?: string }) {
  return (
    <Link href={`/${locale}/groups/${group.slug}`} className="group grid gap-2.5">
      <Cover
        accent={group.accent}
        title={group.name}
        subtitle={group.fandom}
        size="sm"
        className="aspect-[4/3] rounded-3xl transition group-hover:-translate-y-1 group-hover:shadow-[0_10px_24px_rgba(124,92,255,0.18)]"
      />
      <div className="grid gap-1">
        <p className="font-bold leading-snug group-hover:underline">{group.name}</p>
        <p className="text-sm text-muted">{group.agency}</p>
        <div className="flex flex-wrap gap-1">
          <span className="chip">{group.debutYear}</span>
          {membersLabel && <span className="chip">{membersLabel}</span>}
        </div>
      </div>
    </Link>
  );
}
