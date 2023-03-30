import { productCatolgueNet } from '../../../utils/urls';
import {
  CREATECATALOGUE,
  DELETECATALOGUE,
  UPDATECATALOGUEPRICE,
  GETALLCATALOGUE,
  GETCATALOGUEBYCATALOGUEID,
  GETCATALOGUEBYSELLERID,
  DISCARD_CHANGES,
  UNSAVED_CATALOGUE_CHANGES,
  UPDATED_QUANTITY
} from './types'

export const createCatalogue = (values) => (dispatch) => {
  const catalogue = productCatolgueNet()
  catalogue.post('CreateProductCatalogue', values).then((response) => {
    const { result } = response.data
    return dispatch({
      type: CREATECATALOGUE,
      addCatalogue: result
    })
  })
  .catch((error) => {
    return;
  });
}

export const deleteCatalogue = (catalogueId) => (dispatch) => {
  const catalogue = productCatolgueNet()
  catalogue.delete(`DeleteProductCatalogue/${catalogueId}`).then((response) => {
    const { result } = response.data
    return dispatch({
      type: DELETECATALOGUE,
      deleteCatalogue: result
    })
  })
  .catch((error) => {
    return;
  });
}

export const updatePriceCatalogue = (values) => (dispatch) => {
  const catalogue = productCatolgueNet()
  catalogue.patch(`EditProductCatalogue/UpdatePrice`, values).then((response) => {
    const { result } = response.data
    return dispatch({
      type: UPDATECATALOGUEPRICE,
      updatePriceCatalogue: result
    })
  })
  .catch((error) => {
    return;
  });
}

export const cataloguePriceChange =
  (itemsToSave) => (dispatch) => {
    dispatch({
      type: UPDATED_QUANTITY,
      catalogue_quantities: itemsToSave,
    });
  };

export const discardChanges = () => (dispatch) => {
  dispatch({
    type: DISCARD_CHANGES,
  });
};

export const updateCataloguePrice = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_CATALOGUE_CHANGES,
    catalogue_change: action,
  });
};

export const getAllCatalogue = () => (dispatch) => {
  const catalogue = productCatolgueNet()
  catalogue.get("GetProductCatalogue/GetAll").then((response) => {
    return dispatch({
      type: GETALLCATALOGUE,
      getAllCatalogue: response
    })
  })
  .catch((error) => {
    return;
  });
}

export const getCatalogueByCatalogueId = (catalogueId) => (dispatch) => {
  const catalogue = productCatolgueNet()
  catalogue.get(`GetProductCatalogue/GetByProductCatalogueId/${catalogueId}`).then((response) => {
    return dispatch({
      type: GETCATALOGUEBYCATALOGUEID,
      getCatalogueByCatalogueId: response
    })
  })
  .catch((error) => {
    return;
  });
}

export const getCatalogueBySellerId = (sellerCompanyId) => (dispatch) => {
  const catalogue = productCatolgueNet()
  catalogue.get(`GetProductCatalogue/GetByCompanyId/${sellerCompanyId}`).then((response) => {
    return dispatch({
      type: GETCATALOGUEBYSELLERID,
      getCatalogueBySellerId: response
    })
  })
  .catch((error) => {
    return;
  });
}