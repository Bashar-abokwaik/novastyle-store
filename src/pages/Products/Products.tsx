import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { productsService } from "../../services/productsService";

import type { productTemplate } from "../../services/mock/products.mock";

import ProductsControls from "../../components/ProductsComp/ProductsControls";
import ProductsList from "../../components/ProductsComp/ProductsList";

import styles from "../../components/ProductsComp/products.module.css";

interface ProductsProps {
  mode?: "all" | "offers";
}

function Products({ mode = "all" }: ProductsProps) {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<productTemplate[]>([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data =
          mode === "offers"
            ? await productsService.getOffers()
            : await productsService.getAll();

        setProducts(data as productTemplate[]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [mode]);

  let filtered = [...products];
  const categorySlug = slug || "";

  // search filter
  if (search) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // sort
  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  // category filter
  if (categorySlug) {
    filtered = filtered.filter((p) => p.categorySlug === categorySlug);
  }

  return (
    <div className={styles.products}>
      <ProductsControls
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        categorySlug={categorySlug}
        mode={mode}
      />

      <ProductsList products={filtered} showDiscount={mode === "offers"} />
    </div>
  );
}

export default Products;