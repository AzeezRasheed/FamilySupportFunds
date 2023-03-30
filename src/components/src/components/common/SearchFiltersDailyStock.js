import Search from "./Search";
import MultiSelect from "./MultiSelect";
import Sort from "./Sort";
import { useEffect, useState } from "react";
import {
  searchItems,
  searchMultipleItems,
  filterSkus,
  filterProductTypes,
  handleSort,
} from "../../utils/filters";
import { ProductTypes } from "../../utils/data";

const SearchFiltersDailyStock = ({
  tempInventory,
  allInventory,
  setTempInventory,
  skusList,
  productList,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortvalue] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [checkboxValues, setCheckboxValues] = useState([]);

  useEffect(() => {
    const filtered = searchItems(allInventory, searchTerm);
    const selected = filterSkus(filtered, radioValue);
    const productType = filterProductTypes(selected, typeValue);
    const multipleSelected = searchMultipleItems(productType, checkboxValues);
    setTempInventory(multipleSelected);
  }, [searchTerm, radioValue, typeValue, checkboxValues]);

  useEffect(() => {
    const sorted = handleSort(tempInventory, sortValue);
    setTempInventory(sorted);
  }, [sortValue]);

  return (
    <div className="flex">
      <Search setSearchTerm={setSearchTerm} width={"26.063rem"} />
      <MultiSelect
        value="Select Product Type"
        itemsList={ProductTypes}
        type="radio"
        setRadioValue={setTypeValue}
      />
      <MultiSelect
        value=" All SKUs"
        itemsList={skusList}
        type="radio"
        setRadioValue={setRadioValue}
      />
      <MultiSelect
        value="Select Product(s)"
        itemsList={productList}
        type="checkbox"
        setCheckboxValues={setCheckboxValues}
        checkboxValues={checkboxValues}
      />
      <Sort filterableList={allInventory} setSortvalue={setSortvalue} />
    </div>
  );
};

export default SearchFiltersDailyStock;
