export function Island(
  { children, className, noPadding, onMobileExpand }: {
    children?: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    onMobileExpand?: boolean;
  }) {

  const twPadding = noPadding ? '' : 'py-6 px-4 sm:px-6 md:px-8';
  const twExpand = onMobileExpand ? 'max-sm:-mx-4 max-sm:w-screen max-sm:rounded-none' : '';

  return (
    <div className={`w-full bg-card rounded-xl ${twExpand} ${twPadding} ${className || ''}`}>
      {children}
    </div>
  );
}
