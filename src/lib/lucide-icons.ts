import lucideIconData from "virtual:lucide-icons";

export type LucideIconNode = [
  tag: string,
  attrs: Record<string, string | number | undefined>,
][];

export type LucideIcon = {
  name: string;
  token: string;
  label: string;
  node: LucideIconNode;
  searchText: string;
};

type LucideIconData = {
  name: string;
  label: string;
  node: LucideIconNode;
  searchText: string;
};

export const lucideIcons: LucideIcon[] = (lucideIconData as LucideIconData[]).map(
  (icon) => ({
    ...icon,
    token: icon.name,
  }),
);

export const lucideIconMap = new Map(
  lucideIcons.map((icon) => [icon.token, icon]),
);
