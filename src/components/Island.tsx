

export function Island({ children, className }: { children?: React.ReactNode, className?: string }) {
  return (
    <div className={`grid my-6 w-full py-6 px-4 sm:px-6 md:px-8 rounded-xl bg-card ${className}`}>
      {children}
    </div>
  );
}
