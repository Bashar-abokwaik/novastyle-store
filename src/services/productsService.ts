import { api } from "./api/client";

export const getProducts = async () => {
  return api.get("/products");
};