export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  id: number;
  product: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

export interface SignupData {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  password: string;
}