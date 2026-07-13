import { api } from "./api/client";

// The categoriesService object provides methods for managing product categories.
export const categoriesService = {
  // Retrieve all product categories
  getAll: async () => {
    return api.get("/categories");
  },

  // Retrieve a category by its ID
  getById: async (id: string) => {
    return api.get(`/categories/id/${id}`);
  },

  // Retrieve a category by its slug
  getBySlug: async (slug: string) => {
    return api.get(`/categories/slug/${slug}`);
  },

  // Create a new product category
  createCategory: async (name: string, slug: string, imageUrl: string) => {
    return api.post(
      "/categories",
      {
        name,
        slug,
        imageUrl,
      },
      true,
    );
  },

  // Update an existing product category
  updateCategory: async (
    id: string,
    name: string,
    slug: string,
    imageUrl: string,
  ) => {
    return api.put(
      `/categories/${id}`,
      {
        name,
        slug,
        imageUrl,
      },
      true,
    );
  },

  // Delete a product category by its ID
  deleteCategory: async (id: string) => {
    return api.delete(`/categories/${id}`, true);
  },
};
