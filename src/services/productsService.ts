import { api } from "./api/client";

// The productsService object provides methods for managing products.
export const productsService = {

  // Retrieve all products for admin users
  getAllProductsAdmin: async (page: number, limit: number) => {
    return api.get(`/products/admin?page=${page}&limit=${limit}`, true);
  },

  // Retrieve a specific product by its ID for admin users
  getProductByIdAdmin: async (id: string) => {
    return api.get(`/products/admin/${id}`, true);
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
  getAll: async (page = 1, limit = 10, sort?: string) => {
    return api.get(`/products?page=${page}&limit=${limit}&sort=${sort}`);
  },

  // Retrieve products that are discounted
  getOffers: async (page = 1, limit = 10, sort?: string) => {
    return api.get(`/products/offers?page=${page}&limit=${limit}&sort=${sort}`);
  },

  // Retrieve a product by its ID
  getById: async (id: string) => {
    return api.get(`/products/id/${id}`);
  },

  // Retrieve products by category
  getByCategory: async (categorySlug: string, page = 1, limit = 10, sort?: string) => {
    return api.get(`/products/category/${categorySlug}?page=${page}&limit=${limit}&sort=${sort}`);
  },

  // Retrieve discounted products by category
  getByCategoryOffers: async (categorySlug: string, page = 1, limit = 10, sort?: string) => {
    return api.get(`/products/category/${categorySlug}/offers?page=${page}&limit=${limit}&sort=${sort}`);
  },

  // Retrieve products by collection
  getByCollection: async (collectionSlug: string, page = 1, limit = 10) => {
    return api.get(`/products/collection/${collectionSlug}?page=${page}&limit=${limit}`);
  },

  // Retrieve new arrivals 
  getNewArrivals: async (page = 1, limit = 8) => {
    return api.get(`/products/new-arrivals?page=${page}&limit=${limit}`);
  },

  // Retrieve featured products
  getFeatured: async (page = 1, limit = 8) => {
    return api.get(`/products/featured?page=${page}&limit=${limit}`);
  },

};

