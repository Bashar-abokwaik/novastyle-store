import { api } from "./api/client";

export const login = async (data: Record<string, unknown>) => {
  return api.post("/login", data);
};