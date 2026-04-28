import styles from "./home.module.css";
import Hero from "../../components/HomeComp/Hero";
import Categories from "../../components/HomeComp/Categories/Categories";
import NewArrivals from "../../components/HomeComp/NewArrival/NewArrival";
import Offers from "../../components/HomeComp/Offers/Offers";
import Featured from "../../components/HomeComp/Featured/Featured";
import Collections from "../../components/HomeComp/Collections/Collections";

function Home() {
  // throw new Error("Simulated error for testing ErrorPage");
  return (
    <div className={styles.home}>
      <Hero />
      <Categories />
      <NewArrivals />
      <Offers />
      <Featured />
      <Collections />

    </div>
  );
}

export default Home;
