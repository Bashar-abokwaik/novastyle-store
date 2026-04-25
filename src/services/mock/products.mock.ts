import RedHoodieImg from "../../assets/Images/productsImages/Red Hoodie.jpg";
import BlackHoodieImg from "../../assets/Images/productsImages/Black Hoodie.jpg";
import WhiteSneakersImg from "../../assets/Images/productsImages/White Sneakers.jpg";
import BlackJeansImg from "../../assets/Images/productsImages/Black Jeans.jpg";
import GreenTShirtImg from "../../assets/Images/productsImages/Green T-Shirt.jpg";
import BlueDenimJacketImg from "../../assets/Images/productsImages/Blue Denim Jacket.jpg";
import GraphicTShirtImg from "../../assets/Images/productsImages/Graphic T-Shirt.jpg";
import SlimFitJeansImg from "../../assets/Images/productsImages/Slim Fit Jeans.jpg";
import LeatherJacketImg from "../../assets/Images/productsImages/Leather Jacket.jpg";

export type productTemplate = {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  categorySlug: string;

  isNewArrival?: boolean;
  isFeatured?: boolean;
  discount?: number;
};

export const products: productTemplate[] = [
  {
    id: "p1",
    title: "Red Hoodie",
    description: "Soft cotton hoodie with modern street style design.",
    price: 54.99,
    image: RedHoodieImg,
    categoryId: "c1",
    categorySlug: "men",
    isNewArrival: true,
    isFeatured: true,
  },
  {
    id: "p2",
    title: "White Sneakers",
    description: "Comfortable sneakers for everyday wear.",
    price: 79.99,
    image: WhiteSneakersImg,
    categoryId: "c5",
    categorySlug: "footwear",
    isNewArrival: true,
  },
  {
    id: "p3",
    title: "Black Jeans",
    description: "Slim fit black jeans with premium denim quality.",
    price: 59.99,
    image: BlackJeansImg,
    categoryId: "c1",
    categorySlug: "men",
    isNewArrival: true,
  },
  {
    id: "p4",
    title: "Green T-Shirt",
    description: "Casual breathable cotton t-shirt.",
    price: 24.99,
    image: GreenTShirtImg,
    categoryId: "c1",
    categorySlug: "men",
    isNewArrival: true,
  },
  {
    id: "p5",
    title: "Black Hoodie",
    description: "Minimal black hoodie perfect for streetwear outfits.",
    price: 49.99,
    image: BlackHoodieImg,
    categoryId: "c1",
    categorySlug: "men",
    isFeatured: true,
  },
  {
    id: "p6",
    title: "Blue Denim Jacket",
    description: "Classic denim jacket with modern fit.",
    price: 89.99,
    image: BlueDenimJacketImg,
    categoryId: "c2",
    categorySlug: "women",
    isFeatured: true,
  },
  {
    id: "p7",
    title: "Graphic T-Shirt",
    description: "Stylish printed t-shirt for casual wear.",
    price: 29.99,
    image: GraphicTShirtImg,
    categoryId: "c1",
    categorySlug: "men",
    discount: 20,
  },
  {
    id: "p8",
    title: "Slim Fit Jeans",
    description: "Modern slim fit jeans for everyday use.",
    price: 69.99,
    image: SlimFitJeansImg,
    categoryId: "c1",
    categorySlug: "men",
    discount: 15,
  },
  {
    id: "p9",
    title: "Leather Jacket",
    description: "Premium leather jacket for bold look.",
    price: 199.99,
    image: LeatherJacketImg,
    categoryId: "c2",
    categorySlug: "women",
    isFeatured: true,
  },
  {
    id: "p10",
    title: "Sport Sneakers",
    description: "Lightweight sneakers for sports and walking.",
    price: 74.99,
    image: WhiteSneakersImg,
    categoryId: "c5",
    categorySlug: "footwear",
    isNewArrival: true,
  },
  {
    id: "p11",
    title: "Kids Hoodie",
    description: "Warm hoodie designed for kids comfort.",
    price: 39.99,
    image: BlackHoodieImg,
    categoryId: "c4",
    categorySlug: "kids",
    discount: 10,
  },
  {
    id: "p12",
    title: "Luxury Watch",
    description: "Elegant watch with stainless steel finish.",
    price: 249.99,
    image: LeatherJacketImg,
    categoryId: "c7",
    categorySlug: "luxury",
    isFeatured: true,
  },
  {
    id: "p13",
    title: "Street Hoodie",
    description: "Oversized hoodie for streetwear lovers.",
    price: 59.99,
    image: RedHoodieImg,
    categoryId: "c6",
    categorySlug: "streetwear",
    isNewArrival: true,
  },
  {
    id: "p14",
    title: "Denim Shorts",
    description: "Comfortable summer denim shorts.",
    price: 34.99,
    image: BlackJeansImg,
    categoryId: "c1",
    categorySlug: "men",
    discount: 25,
  },
  {
    id: "p15",
    title: "Casual Shirt",
    description: "Lightweight casual shirt for daily wear.",
    price: 44.99,
    image: GraphicTShirtImg,
    categoryId: "c1",
    categorySlug: "men",
  },
  {
    id: "p16",
    title: "Running Shoes",
    description: "High performance running shoes.",
    price: 89.99,
    image: WhiteSneakersImg,
    categoryId: "c5",
    categorySlug: "footwear",
    isNewArrival: true,
  },
  {
    id: "p17",
    title: "Winter Jacket",
    description: "Heavy winter jacket for cold weather.",
    price: 129.99,
    image: BlueDenimJacketImg,
    categoryId: "c2",
    categorySlug: "women",
    isFeatured: true,
  },
  {
    id: "p18",
    title: "Basic T-Shirt",
    description: "Simple cotton t-shirt for everyday use.",
    price: 19.99,
    image: GreenTShirtImg,
    categoryId: "c1",
    categorySlug: "men",
  },
  {
    id: "p19",
    title: "Premium Hoodie",
    description: "High quality hoodie with soft fabric.",
    price: 64.99,
    image: RedHoodieImg,
    categoryId: "c6",
    categorySlug: "streetwear",
    discount: 30,
  },
  {
    id: "p20",
    title: "Leather Boots",
    description: "Durable boots for stylish winter look.",
    price: 149.99,
    image: LeatherJacketImg,
    categoryId: "c5",
    categorySlug: "footwear",
    isFeatured: true,
  },
];
