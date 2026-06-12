import iconFamilies from "virtual:font-awesome-icons";

export type FontAwesomeStyle = "solid" | "regular" | "brands";

export type FontAwesomeIcon = {
  name: string;
  token: string;
  unicode: string;
  label: string;
  style: FontAwesomeStyle;
  fontFamily: string;
  fontWeight: "400" | "900";
  searchText: string;
};

type IconMetadata = {
  name: string;
  unicode: string;
  label: string;
  style: FontAwesomeStyle;
  searchText: string;
};

const iconMetadata = iconFamilies as IconMetadata[];

function iconFont(style: FontAwesomeStyle) {
  return {
    fontFamily:
      style === "brands" ? "Font Awesome 7 Brands" : "Font Awesome 7 Free",
    fontWeight: style === "solid" ? "900" : "400",
  } as const;
}

export const fontAwesomeIcons: FontAwesomeIcon[] = iconMetadata.map((icon) => ({
  ...icon,
  token: `${icon.style}:${icon.name}`,
  unicode: String.fromCodePoint(parseInt(icon.unicode, 16)),
  ...iconFont(icon.style),
}));

export const fontAwesomeIconMap = new Map(
  fontAwesomeIcons.flatMap((icon) => {
    const entries: [string, FontAwesomeIcon][] = [[icon.token, icon]];
    if (icon.style === "solid") entries.push([icon.name, icon]);
    return entries;
  }),
);
