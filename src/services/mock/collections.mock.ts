export type Collection = {
  id: string;
  title: string;
  image: string;
  slug: string;
};

export const collections: Collection[] = [
  {
    id: "col1",
    title: "Summer Collection",
    image: "/images/collections/summer.jpg",
    slug: "summer",
  },
  {
    id: "col2",
    title: "Winter Essentials",
    image: "/images/collections/winter.jpg",
    slug: "winter",
  },
];
