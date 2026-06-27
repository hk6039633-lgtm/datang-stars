export function TangPanel({
  children,
  className = "",
  title,
  titleClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  titleClassName?: string;
}) {
  return (
    <div className={`tang-panel ${className}`}>
      {title !== undefined && (
        <div className="border-b border-amber-100/80 px-5 py-3">
          {typeof title === "string" ? (
            <h3 className={`text-base font-bold tracking-wide text-[#451a03] ${titleClassName}`}>{title}</h3>
          ) : (
            <div className={titleClassName}>{title}</div>
          )}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
