export function Island(
  { title, children, className, as: Component = "div", noPadding, onMobileExpand }: {
    title?: string;
    children?: React.ReactNode;
    className?: string;
    as?: React.ElementType;
    noPadding?: boolean;
    onMobileExpand?: boolean;
  }) {

  const twPadding = noPadding ? '' : 'py-6 px-4 sm:px-6 md:px-8';
  const twExpand = onMobileExpand ? 'max-sm:-mx-4 max-sm:w-screen max-sm:rounded-none' : '';

  return (
    <Component>
      {title && <header className="text-xl font-bold mb-3 px-2">{title}</header>}
      <div className={`w-full bg-card rounded-xl ${twExpand} ${twPadding} ${className || ''}`}>
        {children}
      </div>
    </Component>
  );
}
