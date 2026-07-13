import type { productTemplate } from "../types/index";

export function buildCartItem(product: productTemplate) {
  // Calculate the discounted price if a discount is available, otherwise set it to 0.
  const discountedPrice = product.discount
    ? parseFloat(
        (product.price * (1 - product.discount / 100)).toFixed(2)
      )
    : 0;

  return {
    productId: product.id,
    quantity: 1,
    title: product.title,
    price: product.price,
    discountedPrice,
    image: product.image || "",
  };
}