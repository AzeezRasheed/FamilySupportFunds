import {
  CREATECATALOGUE,
  UPDATECATALOGUEPRICE,
  GETALLCATALOGUE,
  UPDATED_QUANTITY,
  GETCATALOGUEBYSELLERID,
  UNSAVED_CATALOGUE_CHANGES,
  DISCARD_CHANGES
} from '../actions/types'

const initialState = {
  allCatalogue: [],
  allSellersCatalogue: [],
  catalogue: {},
  cataloguePriceChange: false,
  productCatalogueId: null,
  productId: null,
  sellerId: null
}

const ProductCatalogueReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATECATALOGUE:
      return {
        ...state,
        allCatalogue: [...state.allCatalogue, action.addCatalogue],
      };
      case UPDATECATALOGUEPRICE: {
    return { ...state, catalogue: action.updatePriceCatalogue, productCatalogueId: action.updatePriceCatalogue.productCatalogueId, sellerId: action.updatePriceCatalogue.companyId, productId: action.updatePriceCatalogue.productId };
      }
      case UPDATED_QUANTITY: {
        return {
          ...state,
          allCatalogue: action.catalogue_quantities,
        };
      }
      case UNSAVED_CATALOGUE_CHANGES: {
        return {...state, cataloguePriceChange: action.catalogue_change }
      }
      case GETALLCATALOGUE: {
        return {
          ...state,
          allCatalogue: action.getAllCatalogue.data,
        };
      }
      case GETCATALOGUEBYSELLERID: {
        return {
          ...state,
          allSellersCatalogue: action.getCatalogueBySellerId.data,
        };
      }
      case DISCARD_CHANGES: {
        return { ...state, transferChange: false };
        //return {state}//clears the whole store
      }
      default:
      return state;
    }
  }

  export default ProductCatalogueReducer;
