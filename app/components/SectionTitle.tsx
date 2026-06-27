export function SectionTitle({
  children,
  subtitle,
  className = "",
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-8 text-center ${className}`}>
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <h2 className="text-xl font-bold tracking-[0.2em] text-[#451a03]">{children}</h2>
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      </div>
      {subtitle && <p className="text-sm text-amber-700/80">{subtitle}</p>}
    </div>
  );
}
