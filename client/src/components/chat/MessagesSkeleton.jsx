import Skeleton from "../ui/Skeleton";

const rows = [
  { mine: false, w: "w-40" },
  { mine: true, w: "w-32" },
  { mine: false, w: "w-56" },
  { mine: true, w: "w-44" },
  { mine: false, w: "w-24" },
];

export default function MessagesSkeleton() {
  return (
    <div className="flex-1 px-4 py-4 flex flex-col gap-4 text-ink" aria-hidden="true">
      {rows.map((row, i) => (
        <div key={i} className={`flex items-end gap-2 ${row.mine ? "flex-row-reverse" : ""}`}>
          {!row.mine && <Skeleton className="w-7 h-7 rounded-full" />}
          <div className="flex flex-col gap-1.5">
            <Skeleton className={`h-2 w-16 ${row.mine ? "self-end" : ""}`} />
            <Skeleton className={`${row.w} h-9 rounded-xl`} />
          </div>
        </div>
      ))}
    </div>
  );
}