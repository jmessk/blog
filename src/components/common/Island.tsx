export function Island(
  { title, children, className, noPadding, onMobileExpand }: {
    title?: string;
    children?: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    onMobileExpand?: boolean;
  }) {

  const twPadding = noPadding ? '' : 'py-6 px-4 sm:px-6 md:px-8';
  const twExpand = onMobileExpand ? 'max-sm:-mx-4 max-sm:w-screen max-sm:rounded-none' : '';

  return (
    <div>
      {title && <h2 className="text-xl font-bold mb-3 px-2">{title}</h2>}
      <div className={`w-full bg-card rounded-xl ${twExpand} ${twPadding} ${className || ''}`}>
        {children}
      </div>
    </div>
  );
}
