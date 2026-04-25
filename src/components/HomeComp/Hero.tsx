import Carousel from "../UI/Carousel";
import Image1 from "../../assets/Images/1.png";
import Image2 from "../../assets/Images/2.png";
import Image3 from "../../assets/Images/3.png";

export type CarouselImage = {
  id: number;
  src: string;
  alt: string;
  link: string;
};

export default function Hero() {
  const images: CarouselImage[] = [
    {id: 1, src: Image1, alt: "Hero Image 1", link : "#NewArrivals"},
    {id: 2, src: Image2 , alt: "Hero Image 2" , link : "#collections"},
    {id: 3, src: Image3 , alt: "Hero Image 3" , link : "#offers"},
  ];

  return (
      <Carousel images={images} />
  )
}
