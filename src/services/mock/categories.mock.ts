import menImage from "../../assets/Images/categoriesImages/men1.jpg";
import womenImage from "../../assets/Images/categoriesImages/women.jpg";
import accessoriesImage from "../../assets/Images/categoriesImages/accessories.jpg";
import footwearImage from "../../assets/Images/categoriesImages/footwear.jpg";
import kidsImage from "../../assets/Images/categoriesImages/kids.jpg";
import streetwearImage from "../../assets/Images/categoriesImages/streetwear.jpg";
import luxuryImage from "../../assets/Images/categoriesImages/luxury.jpg";


export type categoryTemplate = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

export const categories: categoryTemplate[] = [
  {
    id: "c1",
    name: "Men",
    slug: "men",
    image: menImage,
  },
  {
    id: "c2",
    name: "Women",
    slug: "women",
    image: womenImage,
  },
  {
    id: "c3",
    name: "Accessories",
    slug: "accessories",
    image: accessoriesImage,
  },
  {
    id: "c4",
    name: "Kids",
    slug: "kids",
    image: kidsImage,
  },
  {
    id: "c5",
    name: "Footwear",
    slug: "footwear",
    image: footwearImage,
  },
  {
    id: "c6",
    name: "Streetwear",
    slug: "streetwear",
    image: streetwearImage,
  },
  {
    id: "c7",
    name: "Luxury",
    slug: "luxury",
    image: luxuryImage,
  },
];