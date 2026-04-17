// ===== COMMON =====

// export type ApiResponse<T> = {
//   data: T;
//   message?: string;
// };

// export type ApiError = {
//   message: string;
//   status?: number;
// };

// ===== PRODUCT =====
export type Product = {
  id: number;
  title: string;
  price: number;
  image?: string;
};

// ===== AUTH =====
export type User = {
  id: number;
  email: string;
};

export type LoginData = {
  email: string;
  password: string;
};

// ===== CART =====
export type CartItem = {
  id: number;
  quantity: number;
  product: Product;
};

// ===== FOOTER =====

export type FooterLinks = {
  company: string[];
  support: string[];
  social: string[];
}