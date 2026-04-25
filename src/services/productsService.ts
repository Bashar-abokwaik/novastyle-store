// import { api } from "./api/client";

// export const getProducts = async () => {
//   return api.get("/products");
// };

import { products } from "./mock/products.mock";

export const productsService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter((p) => p.discount === undefined || p.discount === 0));
      }, 500); // simulate API delay
    });
  },

  getOffers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter((p) => p.discount && p.discount > 0));
      }, 500); // simulate API delay
    });
  },



  getById: async (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = products.find((p) => p.id === id);
        if (product) {
          resolve(product);
        } else {
          reject(new Error("Product not found"));
        }
      }, 500); // simulate API delay
    });
  },

  getByCategory: async (categoryId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          products.filter((product) => product.categoryId === categoryId),
        );
      }, 500); // simulate API delay
    });
  },

  getNewArrivals: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter((product) => product.isNewArrival));
      }, 500); // simulate API delay
    });
  },

  getFeatured: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter((product) => product.isFeatured));
      }, 500); // simulate API delay
    });
  },

  getDiscounted: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          products.filter(
            (product) => product.discount && product.discount > 0,
          ),
        );
      }, 500); // simulate API delay
    });
  },
  getDiscountedPrice: (price: number, discount: number) => {
    return price - (price * discount) / 100;
  },
};
