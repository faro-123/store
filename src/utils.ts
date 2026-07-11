import { products as localProducts } from './data/products';

export const currency = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

export function getProduct(id: string) {
  return localProducts.find((product) => product.id === id);
}

export function cartTotal(cart: { productId: string; quantity: number }[], remoteProducts?: { id: string; price: number }[]) {
  return cart.reduce((sum, item) => {
    const local = localProducts.find((p) => p.id === item.productId);
    if (local) return sum + local.price * item.quantity;
    const remote = remoteProducts?.find((p) => p.id === item.productId);
    return sum + (remote?.price ?? 0) * item.quantity;
  }, 0);
}

export function findProduct(id: string, remoteProducts?: { id: string; title: string; description: string; image: string; price: number; demoUrl: string; features: string[]; tags: string[]; code: string; accent: string }[]) {
  const local = localProducts.find((p) => p.id === id);
  if (local) return local;
  return remoteProducts?.find((p) => p.id === id);
}
