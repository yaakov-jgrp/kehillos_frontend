import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/helpers";
import LeftDisableArrow from "../../assets/images/left_disable_arrow.svg";
import RightEnableArrow from "../../assets/images/right_enable_arrow.svg";
import { t } from "i18next";

export const FieldVersionHistory = ({
  setShowFieldHistoryBox,
  formVersionsArray,
}) => {
  const { first_name } = JSON.parse(localStorage.getItem("user_details"));
  const [count, setCount] = useState(0);
  const formVersion = formVersionsArray[count];

  const increaseCount = () => {
    setCount((prevCount) => {
      if (prevCount === formVersionsArray.length - 1) {
        return 0;
      }
      return prevCount + 1;
    });
  };

  const decreaseCount = () => {
    setCount((prevCount) => {
      if (prevCount === 0) {
        return formVersionsArray.length - 1;
      }
      return prevCount - 1;
    });
  };

  return formVersion ? (
    <div
      onMouseLeave={() => {
        setShowFieldHistoryBox(false);
      }}
      className={`z-[100000] w-[370px] h-[250px] overflow-visible rounded-lg scrollbar-hide absolute -top-10 right-[20px] bg-white shadow-lg`}
    >
      <div className="bg-[#F9FBFC] w-full p-3 flex flex-col gap-2 sticky top-0 left-0">
        <div className="flex items-center justify-between">
          <p className="text-[#344054] font-medium text-[14px]">
            {formVersion.name}
          </p>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => decreaseCount()}
              disabled={formVersionsArray.length === 1 || count === 0}
            >
              {count === 0 ? (
                <img src={LeftDisableArrow} alt="LeftDisableArrow" />
              ) : (
                <img
                  src={RightEnableArrow}
                  alt="RightEnableArrow"
                  className="transform rotate-180"
                />
              )}
            </button>
            <button
              onClick={() => increaseCount()}
              disabled={
                formVersionsArray.length === 1 ||
                count === formVersionsArray.length - 1
              }
            >
              {count === formVersionsArray.length - 1 ? (
                <img
                  src={LeftDisableArrow}
                  alt="LeftDisableArrow"
                  className="transform rotate-180"
                />
              ) : (
                <img src={RightEnableArrow} alt="RightEnableArrow" />
              )}
            </button>
          </div>
        </div>
        <div>
          <p className="text-[#000] font-medium text-[14px]">{first_name}</p>
          <p className="text-[#828282] font-medium text-[14px]">
            {formatDate(formVersion.createdAt)}
          </p>
        </div>
      </div>

      <div className="px-3 py-2">
        <p className="text-[#000] font-medium text-[14px]">
          {t("forms.comment")}
        </p>
        <p className="text-[#828282] font-medium text-[14px]">
          {formVersion.comment}
        </p>
      </div>

      <div className="px-3 py-1">
        {formVersion.dirty_fields.map((dirtyField) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-24">
              <p className="text-[#000] font-medium text-[14px]">
                {dirtyField?.name ? `${dirtyField?.name} (Current)` : "Current"}
              </p>
              <p className="text-[#828282] font-medium text-[14px]">
                :{`${dirtyField.current}`}
              </p>
            </div>
            <div className="flex items-center gap-24">
              <p className="text-[#000] font-medium text-[14px]">
                {dirtyField?.name
                  ? `${dirtyField?.name} (Previous)`
                  : "Previous"}
              </p>
              <p className="text-[#828282] font-medium text-[14px]">
                :{`${dirtyField.previous}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};
