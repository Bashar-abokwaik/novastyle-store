// ===== PRODUCT =====
export type productTemplate = {
  _id: string;
  title: string;
  description: string;
  price: number;
  costPrice: number;
  imageUrl?: string;
  stock: number;
  categoryId: string;
  categorySlug: string;
  collectionId?: string;
  collectionSlug?: string;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  discount?: number;

  [key: string]: string | number | boolean | object | undefined;
};

// ===== AUTH =====
export type User = {
  _id: string;
  email: string;
  name: string;
  token: string;
  role: string;
  address?: {
    country: string;
    city: string;
    street: string;
    postalCode: string;
  };
  [key: string]: string | number | boolean | object | undefined;
};

export type LoginData = {
  email: string;
  password: string;
};

// ===== FOOTER =====

export type FooterLinks = {
  company: string[];
  support: string[];
  social: string[];
};

// ===== CAROUSEL =====
export type CarouselProps = {
  images: {
    link: string | undefined;
    _id: string;
    src: string;
  }[];
};

// ===== CATEGORY =====
export type Category = {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  [key: string]: string | number | boolean | object | undefined;
};

// ===== COLLECTION =====
export type Collection = {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  [key: string]: string | number | boolean | object | undefined;
};

// ===== Address =====
export interface Address {
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

// ===== Order =====
export interface OrderItem {
  _id: string;
  productId: productTemplate;
  quantity: number;
  price: number;
}

export interface OrderUser {
  _id: string;
  email: string;
}

export interface Order {
  _id: string;
  shippingAddress: Address;
  userId: OrderUser;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
