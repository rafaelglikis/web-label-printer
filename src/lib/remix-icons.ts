import remixIconData from "virtual:remix-icons";

export type RemixIcon = {
  name: string;
  token: string;
  label: string;
  category: string;
  style: "fill" | "line";
  unicode: string;
  searchText: string;
};

type RemixIconData = {
  name: string;
  label: string;
  category: string;
  style: "fill" | "line";
  unicode: string;
  searchText: string;
};

export const remixIcons: RemixIcon[] = (remixIconData as RemixIconData[]).map(
  (icon) => ({
    ...icon,
    token: icon.name,
  }),
);

export const remixIconMap = new Map(
  remixIcons.map((icon) => [icon.token, icon]),
);
