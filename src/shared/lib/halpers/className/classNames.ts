export type Mods = Record<string, boolean | string | undefined>;

export const classNames = (className: string, mods: Mods = {}, additional: (string | undefined)[] = []) => [
  className,
  ...Object.entries(mods)
    .filter(([className, value]) => Boolean(value))
    .map(([className, value]) => className),
  ...additional,
].join(' ');
