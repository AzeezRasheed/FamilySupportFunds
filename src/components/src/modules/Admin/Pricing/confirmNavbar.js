import { t } from "i18next";
import React from "react";
import TransparentLogo from "../../../assets/images/transparentLogo.png";

function ConfirmNavbar(props) {
  if (!props.active) {
    return null;
  }
  return (
    <div className="bg-red-main flex justify-between items-center fixed z-30 top-0 left-0 shadow-xl h-20 w-full p-3">
      <div className="flex mt-1">
        <img src={TransparentLogo} alt="logo" />
      </div>
      <div className="flex gap-8 items-center font-customGilroy text-center font-semibold w-9/12">
        <p className="text-white italic text-2xl">
          {t("you_have_unsaved_changes_Do_you_want_to_save_your_changes?")}
        </p>
        <button className="text-white text-base border border-white rounded not-italic py-3 px-5">
          {t("discard_changes")}
        </button>
        <button className="bg-white text-black rounded not-italic py-3 px-6">
          {t("save")}
        </button>
      </div>
    </div>
  );
}

export default ConfirmNavbar;
