// React imports
import React, { useState } from "react";

// Third part Imports
import { useTranslation } from "react-i18next";

function LogChanges({ changes }) {
  const { t } = useTranslation();
  const [more, setMore] = useState(false);

  return changes ? (
    <div className="flex flex-col justify-center items-center gap-4">
      {changes.slice(0, 2).map((change, i) => {
        return (
          <div key={i} className="flex flex-row w-full break-words px-2 gap-12">
            <div>
              <div className="bg-[#F5F5F5] rounded-full w-[98px] flex justify-center items-center py-2">
                <p className="text-gray-10">Old Value</p>
              </div>
              <div className="flex">
                <p className="text-gray-10 font-medium">{change?.label} :</p>
                <p className="">
                  {" "}
                  {`${t("logs.old")} - ${
                    typeof change.old_value === "object"
                      ? change.old_value?.file_name
                      : change.old_value
                  }`}
                </p>
              </div>
            </div>

            <div>
              <div className="bg-[#F2F8FB] rounded-full w-[98px] flex justify-center items-center py-2">
                <p className="text-gray-10">New Value</p>
              </div>
              <div className="flex">
                <p className="text-gray-10 font-medium">{change?.label} :</p>
                <p className="truncate">{`${t("logs.new")} - ${
                  typeof change.new_value === "object"
                    ? change.new_value?.file_name
                    : change.new_value
                }`}</p>
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex flex-col">
        {more && (
          <>
            {changes.slice(2).map((change, i) => {
              return (
                <div key={i} className="flex flex-col w-full break-words ">
                  <p className="mx-2 text-gray-10 font-medium">
                    {change?.label} :
                  </p>
                  <p className="mx-2">
                    {typeof change?.value === "object"
                      ? change?.value?.file_name
                      : change?.value}
                  </p>
                </div>
              );
            })}
          </>
        )}
        {changes.length > 2 && (
          <p
            className="text-xs font-normal text-brand-500 mx-2 justify-self-end cursor-pointer"
            onClick={() => setMore(!more)}
          >
            {more ? t("common.viewLess") : t("common.viewMore")}
          </p>
        )}
      </div>
    </div>
  ) : (
    "-"
  );
}

export default LogChanges;
