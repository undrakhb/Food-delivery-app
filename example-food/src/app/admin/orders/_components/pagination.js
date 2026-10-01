import { ChevronLeft, ChevronRight } from "lucide-react";

const GAP = "gap";

// At most 7 slots: the first and last page, the current one with its
// neighbours, and gaps for the rest.
function pageItems(current, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, GAP, count];
  if (current >= count - 3) {
    return [1, GAP, count - 4, count - 3, count - 2, count - 1, count];
  }
  return [1, GAP, current - 1, current, current + 1, GAP, count];
}

const itemClass =
  "flex size-9 items-center justify-center rounded-full text-sm transition-colors";

export function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-end gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${itemClass} text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent`}
      >
        <ChevronLeft className="size-4" />
      </button>

      {pageItems(page, pageCount).map((item, index) =>
        item === GAP ? (
          <span key={`gap-${index}`} className={`${itemClass} bg-white text-zinc-500`}>
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
            className={`${itemClass} ${
              item === page
                ? "bg-zinc-900 font-medium text-white"
                : "bg-white text-zinc-900 hover:bg-zinc-200"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={`${itemClass} text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent`}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
