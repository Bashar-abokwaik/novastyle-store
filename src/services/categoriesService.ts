import { categories } from "./mock/categories.mock";

export const categoriesService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories);
      }, 500); // simulate API delay
    });
  },
};