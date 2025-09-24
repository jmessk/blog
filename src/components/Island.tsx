export function Island(
  { children, className, noPadding: noPadding, onMobileExpand }: {
    children?: React.ReactNode,
    className?: string,
    noPadding?: boolean,
    onMobileExpand?: boolean,
  }) {

  const twPadding = noPadding ? '' : 'px-4 sm:px-6 md:px-8';
  const twExpand = onMobileExpand ? 'max-sm:-mx-4 max-sm:w-screen max-sm:rounded-none' : '';

  return (
    <div className={`grid my-6 py-6 w-full bg-card rounded-xl ${twExpand} ${twPadding} ${className}`}>
      {children}
    </div>
  );
}
