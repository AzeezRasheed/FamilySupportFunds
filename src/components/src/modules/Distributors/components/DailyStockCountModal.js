import { t } from 'i18next';
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Dialog, Transition } from "@headlessui/react";
import { formatNumber } from '../../../utils/formatNumber';
import Loading from "../../../components/common/Loading";
import { Checked, CloseModal } from "../../../assets/svg/modalIcons";
import { 
  getAllInventory, setDailyStockModal, updateAccurateDailyStockCount 
} from '../../Inventory/actions/inventoryProductAction';
import { formatEmptiesQuantity, stripProductTypeFromSku, stripSkuFromBrandName } from '../../../utils/helperFunction';
import Tag from '../../Inventory/components/Tag';

const DailyStockCountModal = ({code, countryConfigObject, country}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [save, setSave] = useState("Yes, I'm sure");
  const [loading, setLoading] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const dailyStockModal = useSelector(
    (state) => state.InventoryReducer.dailyStockModal
  );

  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );

  useEffect(() => {
    dispatch(getAllInventory(code));
  }, [code]);

  const updateDB = () => {
    let stocks = [];
    setLoading(true);
    setSave("Please wait");
    allInventory.forEach((value) => {
      stocks.push({
        productId: value.productId,
        quantity: value.quantity,
      });
    });
    const toDB = {
      companyCode: code,
      country: country === "South Africa" ? "SA" : country,
      accurate: true,
      stocks,
    };
    dispatch(updateAccurateDailyStockCount(toDB));
    setLoading(false);
    setSave("Yes, I'm sure");
    setApprovalModal(false);
    setSuccessModal(true);
  };

  return (
    <>
      <Transition.Root show={dailyStockModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => {
            "";
          }}
        >
          <div className="flex items-end justify-center min-h-screen w-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            {/* This element is to trick the browser into centering the modal contents. */}
            <label
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </label>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className={`font-customGilroy inline-block align-bottom bg-white pt-6 rounded-lg text-left overflow-hidden 
                shadow-xl transform transition-all sm:my-8 lg:mt-12 lg:mb-10 sm:align-middle w-modal max-h-screen`}
                style={{ width: 800 }}
              >
                <div className="mb-7 px-8">
                  <p
                    style={{
                      fontSize: 32,
                      color: "#090B17",
                    }}
                  >
                    {t('daily_stock_count')}
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      marginTop: 16,
                      color: "#2D2F39",
                    }}
                  >
                    Is this your inventory as of today?
                  </p>
                </div>
                <div className="daily-stock-modal overflow-y-scroll scrollbar-hide">
                  <table
                    className="divide-y divide-gray-200 font-customGilroy"
                    style={{ width: "100%" }}
                  >
                    <thead className="bg-transparent ">
                      <tr className="font-semibold">
                        <th
                          scope="col"
                          className="px-8 pb-3 text-sm text-black tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 pb-3 text-sm text-black tracking-wider w-48"
                        >
                          {t("Quantity")}
                          <Tag 
                            className='bg--blue'
                            tagName={t("fulls")}
                          />
                        </th>
                        <th
                          scope="col"
                          className="px-6 pb-3 text-sm text-black tracking-wider w-48"
                        >
                          {t("Quantity")}
                          <Tag 
                            className='bg--accent'
                            tagName={t("empties")}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white px-6 divide-y divide-gray-200">
                      {allInventory.map((value, index) => (
                        <tr key={index}>
                          <td className='px-8 py-2'>
                            <div className="flex items-center h-16">
                              <div className="flex-shrink-0 w-10">
                                <img
                                  className="w-10 rounded-full"
                                  src={value?.product?.imageUrl}
                                  alt={value?.product?.brand}
                                />
                              </div>
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {stripSkuFromBrandName(value?.product?.brand)}
                                </div>
                                <div
                                  className="font-customGilroy inline-flex text-xs leading-5"
                                >
                                  {stripProductTypeFromSku(value?.product?.sku)}
                                  <span className='ml-1'>
                                   ({value?.product?.productType})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-sm w-48 px-6">
                            {formatNumber(value?.quantity)}
                          </td>
                          <td className={`text-sm w-48 px-6 ${formatEmptiesQuantity(value?.product?.productType, value.empties) === 'Nil' && 'text--accent'}`}>
                            {formatEmptiesQuantity(value?.product?.productType, value.empties)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="border border-solid bg-gray-50 px-8 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-4"
                >
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-3"
                    onClick={() => {
                      dispatch(setDailyStockModal(false));
                      setApprovalModal(true);
                    }}
                    style={{
                      backgroundColor: countryConfigObject.buttonColor,
                      color: countryConfigObject.textColor,
                    }}
                  >
                    Yes
                  </button>

                  <button
                    className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-14 py-3"
                    onClick={() => {
                      dispatch(setDailyStockModal(false));
                      history.push("/dashboard/daily-stock/" + code);
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={approvalModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => {
            "";
          }}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <label
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </label>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-mini-modal">
                <CloseModal
                  className="ml-auto m-4 mb-0"
                  onClick={() => {
                    setApprovalModal(false);
                    dispatch(setDailyStockModal(true));
                  }}
                />
                <div className="h-mini-modal flex justify-center items-center">
                  <p className="font-customGilroy not-italic text-base font-medium">
                    Are you sure this is your correct inventory as of today?
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={() => updateDB()}
                    style={{
                      display: "flex",
                      backgroundColor: countryConfigObject.buttonColor,
                      color: countryConfigObject.textColor,
                    }}
                  >
                    {save}
                    {loading ? <Loading /> : ""}
                  </button>

                  <button
                    className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={() => {
                      setApprovalModal(false);
                      dispatch(setDailyStockModal(true));
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={successModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setSuccessModal}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <label
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </label>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-mini-modal">
                <button
                  className="flex justify-center ml-auto m-4 mb-0"
                  onClick={() => setSuccessModal(false)}
                >
                  <CloseModal />
                </button>
                <div
                  className="h-mini-modal flex justify-center items-center"
                  style={{ flexDirection: "column" }}
                >
                  <Checked />
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                    Daily stock count completed
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    style={{
                      backgroundColor: countryConfigObject.buttonColor,
                      color: countryConfigObject.textColor,
                    }}
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default DailyStockCountModal
