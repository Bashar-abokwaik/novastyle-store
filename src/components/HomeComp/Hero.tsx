import Carousel from "../UI/Carousel";
import Image1 from "../../assets/Images/1.png";
import Image2 from "../../assets/Images/2.png";
import Image3 from "../../assets/Images/3.png";

// Define the structure of a carousel image object
export type CarouselImage = {
  _id: string;
  src: string;
  link: string | undefined;
};

export default function Hero() {
  // Define the images to be displayed in the carousel, each with a unique ID, source, and link
  const images: CarouselImage[] = [
    {_id: "1", src: Image1, link : "#NewArrivals"},
    {_id: "2", src: Image2 , link : "#collections"},
    {_id: "3", src: Image3 , link : "#offers"},
  ];

  return (
      <Carousel images={images} />
  )
}
