export const sheetTitleClass = "text-xl font-semibold text-zinc-500";

// White rounded section inside the cart sheet.
export function SheetCard({ title, className = "", children }) {
  return (
    <section
      className={`flex flex-col gap-5 rounded-[20px] bg-white p-4 text-zinc-900 ${className}`}
    >
      <h3 className={sheetTitleClass}>{title}</h3>
      {children}
    </section>
  );
}
