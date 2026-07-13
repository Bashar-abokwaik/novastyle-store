// This function calculates the discounted price of a product based on its original price and the discount percentage.
export const getDiscountedPrice = (price: number, discount: number) => {
  return price - (price * discount) / 100;
};

