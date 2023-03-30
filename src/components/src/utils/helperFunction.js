import { formatNumber } from "./formatNumber";

export const stripSkuFromBrandName = (product) => {
  if (product.toLowerCase().includes('mls') || product.toLowerCase().includes('ml')) {
    const newProduct = product.substring(0, product.lastIndexOf(' '));
    return newProduct;
  }
  return product;
};

export const stripProductTypeFromSku = (sku) => {
  if (sku.toLowerCase().includes('rb') || sku.toLowerCase().includes('nrb')) {
    const newSku = sku.substring(0, sku.lastIndexOf(' '));
    return newSku;
  }
  return sku;
};

export const formatEmptiesQuantity = (type, empties) => {
  const productType = type?.toLowerCase();
  return (
    productType === 'can' || productType === 'pet' || productType === 'nrb'
    ? 'Nil' : formatNumber(empties))
}
