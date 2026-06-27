const variantMap = {
  default: "border-amber-200/80 bg-amber-50/80 text-amber-800",
  category: "border-amber-300/80 bg-[#f3e9d8] text-[#5c3a1e] font-medium",
  alias: "border-amber-100 bg-[#fdfbf7] text-amber-700",
  event: "border-amber-100 bg-amber-50/70 text-amber-700",
  score: "border-amber-300 bg-amber-100 text-amber-900 font-semibold",
  active: "border-amber-700 bg-amber-800 text-white",
};

export function TangTag({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variantMap;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
