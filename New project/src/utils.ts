import { products } from './data/products';

export const currency = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function cartTotal(cart: { productId: string; quantity: number }[]) {
  return cart.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
}
