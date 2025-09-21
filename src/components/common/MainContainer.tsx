

export function MainContainer({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`mt-12 max-w-4xl w-full mx-auto px-4 sm:px-8 md:px-12 ${className}`}>
      {children}
    </div>
  );
}
