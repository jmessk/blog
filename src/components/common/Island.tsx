export function Island(
  { children, className, noPadding, noMargin, onMobileExpand }: {
    children?: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    noMargin?: boolean;
    onMobileExpand?: boolean;
  }) {

  const twPadding = noPadding ? '' : 'py-6 px-4 sm:px-6 md:px-8';
  const twExpand = onMobileExpand ? 'max-sm:-mx-4 max-sm:w-screen max-sm:rounded-none' : '';
  const twMargin = noMargin ? '' : 'my-6';

  return (
    <div className={`${twMargin} w-full bg-card rounded-xl ${twExpand} ${twPadding} ${className || ''}`}>
      {children}
    </div>
  );
}
