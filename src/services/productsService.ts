import { api } from "./api/client";

// The productsService object provides methods for managing products.
export const productsService = {

  // Retrieve all products for admin users
  getAllProductsAdmin: async () => {
    return api.get("/products/admin", true);
  },

  // Create a new product
  createProduct: async (productData: Record<string, unknown>) => {
    return api.post("/products", productData, true);
  },

  // Update an existing product
  updateProduct: async (id: string, productData: Record<string, unknown>) => {
    return api.put(`/products/${id}`, productData, true);
  },

  // Delete a product by its ID
  deleteProduct: async (id: string) => {
    return api.delete(`/products/${id}`, true);
  },

  // Retrieve all products
  getAll: async () => {
    return api.get("/products");
  },

  // Retrieve products that are discounted
  getOffers: async () => {
    return api.get("/products/offers");
  },

  // Retrieve a product by its ID
  getById: async (id: string) => {
    return api.get(`/products/id/${id}`);
  },

  // Retrieve products by category
  getByCategory: async (categorySlug: string) => {
    return api.get(`/products/category/${categorySlug}`);
  },

  // Retrieve products by collection
  getByCollection: async (collectionSlug: string) => {
    return api.get(`/products/collection/${collectionSlug}`);
  },

  // Retrieve new arrivals 
  getNewArrivals: async () => {
    return api.get("/products/new-arrivals");
  },

  // Retrieve featured products
  getFeatured: async () => {
    return api.get("/products/featured");
  },

};

