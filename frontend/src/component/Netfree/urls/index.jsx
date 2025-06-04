import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import NetfreeTabs from "../NetfreeTabs";
import Rules from "./rules";
import Workflows from "./workflows";

const Urls = () => {
  const { t } = useTranslation();
  const urlTabs = [t("netfree.rules"), t("netfree.workflows")];
  const [tab, setTab] = useState(0);
  const handleChange = (e, value) => {
    setTab(value);
  };
  return (
    <div className="shadow-custom rounded-2xl px-4 py-3 flex flex-col gap-3 bg-white">
      <div className="flex flex-col items-start justify-between w-full">
        <NetfreeTabs
          currentTab={tab}
          handleTabChange={handleChange}
          tabsArray={urlTabs}
        />
        <div className="flex items-center gap-1 w-full">
          {tab === 0 && <Rules />}
          {tab === 1 && <Workflows />}
        </div>
      </div>
    </div>
  );
};

export default Urls;
