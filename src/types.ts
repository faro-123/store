export type CategoryId = 'ui' | 'tools' | 'templates' | 'plugins';

export type Product = {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  tags: string[];
  accent: string;
  image: string;
  demoUrl: string;
  code: string;
  features: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type User = {
  name: string;
  email: string;
  userId: string;
};
