import { api } from "./api/client";

// The collectionsService object provides methods for managing product collections.
export const collectionsService = {
  // Retrieve all product collections
  getAll: async () => {
    return api.get("/collections");
  },

  // Retrieve a collection by its ID
  getById: async (id: string) => {
    return api.get(`/collections/id/${id}`);
  },

  // Retrieve a collection by its slug
  getBySlug: async (slug: string) => {
    return api.get(`/collections/slug/${slug}`);
  },

  // Create a new product collection
  createCollection: async (name: string, slug: string, imageUrl: string) => {
    return api.post(
      "/collections",
      {
        name,
        slug,
        imageUrl,
      },
      true,
    );
  },

  // Update an existing product collection
  updateCollection: async (
    id: string,
    name: string,
    slug: string,
    imageUrl: string,
  ) => {
    return api.put(
      `/collections/${id}`,
      {
        name,
        slug,
        imageUrl,
      },
      true,
    );
  },

  // Delete a product collection by its ID
  deleteCollection: async (id: string) => {
    return api.delete(`/collections/${id}`, true);
  },
};
