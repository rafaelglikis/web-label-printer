import materialIconData from "virtual:material-icons";

export type MaterialIconStyle =
  | "filled"
  | "outlined"
  | "round"
  | "sharp"
  | "two-tone";

export type MaterialIcon = {
  name: string;
  token: string;
  label: string;
  style: MaterialIconStyle;
  fontFamily: string;
  searchText: string;
};

type MaterialIconData = {
  name: string;
  label: string;
  style: MaterialIconStyle;
  searchText: string;
};

const materialFonts: Record<MaterialIconStyle, string> = {
  filled: "Material Icons",
  outlined: "Material Icons Outlined",
  round: "Material Icons Round",
  sharp: "Material Icons Sharp",
  "two-tone": "Material Icons Two Tone",
};

export const materialIcons: MaterialIcon[] = (
  materialIconData as MaterialIconData[]
).map((icon) => ({
  ...icon,
  token: `${icon.style}:${icon.name}`,
  fontFamily: materialFonts[icon.style],
}));

export const materialIconMap = new Map(
  materialIcons.flatMap((icon) => {
    const entries: [string, MaterialIcon][] = [[icon.token, icon]];
    if (icon.style === "outlined") entries.push([icon.name, icon]);
    return entries;
  }),
);
