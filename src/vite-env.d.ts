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
