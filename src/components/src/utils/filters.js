import { flatten } from "lodash";

export const searchItems = (filterableList, query) => {
  if (query === "") {
    return filterableList;
  }

  return filterableList.filter((inventory) => {
    if (inventory.product.brand.toLowerCase().includes(query.toLowerCase())) {
      return inventory;
    }

    if (inventory.product.sku.toLowerCase().includes(query.toLowerCase())) {
      return inventory;
    }
  });
};

export const searchMultipleItems = (filterableList, queryList) => {
  if (queryList.length < 1) {
    return filterableList;
  }
  let filteredValues = [];
  for (let i in queryList) {
    filteredValues.push(searchItems(filterableList, queryList[i]));
  }
  return flatten(filteredValues);
};

export const filterSkus = (filterableList, query) => {
  if (query === "All SKUs") {
    return filterableList;
  }

  return filterableList.filter((inventory) => {
    if (inventory.product.sku.toLowerCase().includes(query.toLowerCase())) {
      return inventory;
    }
  });
};

export const filterProductTypes = (filterableList, query) => {
  if (query === "" || query === "All Products") {
    return filterableList;
  }
  if (query === "ABI Products") {
    return filterableList.filter((inventory) => inventory.is_abi === true);
  }

  if (query === "Other Products") {
    return filterableList.filter((inventory) => inventory.is_abi === false);
  }
};

export const handleSort = (filterableList, radioValue) => {
  let sortedData = [];

  if (radioValue === "Product Name (A - Z)") {
    sortedData = [...filterableList].sort((a, b) => {
      if (a.product.brand.toLowerCase() < b.product.brand.toLowerCase()) {
        return -1;
      }

      if (a.product.brand.toLowerCase() > b.product.brand.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }

  if (radioValue === "Product Name (Z - A)") {
    sortedData = [...filterableList].sort((a, b) =>
      a.product.brand.toLowerCase() < b.product.brand.toLowerCase() ? 1 : -1
    );
  }

  if (radioValue === "Quantity (High to Low)") {
    sortedData = [...filterableList].sort((a, b) => b.quantity - a.quantity);
  }

  if (radioValue === "Quantity (Low to High)") {
    sortedData = [...filterableList].sort((a, b) => a.quantity - b.quantity);
  }

  if (sortedData.length < 1) {
    return filterableList;
  }

  return sortedData;
};

export const getProductList = (inventory) => {
  const productList = [];
  for (let index in inventory) {
    if (!productList.includes(inventory[index].product.brand)) {
      productList.push(inventory[index].product.brand);
    }
  }
  return productList;
};

export const getSkuList = (inventory) => {
  const skusList = ["All SKUs"];
  for (let index in inventory) {
    if (!skusList.includes(inventory[index].product.sku)) {
      skusList.push(inventory[index].product.sku);
    }
  }
  return skusList;
};
