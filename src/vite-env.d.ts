declare module "virtual:font-awesome-icons" {
  const icons: {
    name: string;
    unicode: string;
    label: string;
    style: "solid" | "regular" | "brands";
    searchText: string;
  }[];

  export default icons;
}

declare module "virtual:material-icons" {
  const icons: {
    name: string;
    label: string;
    style: "filled" | "outlined" | "round" | "sharp" | "two-tone";
    searchText: string;
  }[];

  export default icons;
}
