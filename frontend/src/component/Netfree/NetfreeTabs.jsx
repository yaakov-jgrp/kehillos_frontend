import React from "react";

// Utils imports

// Third part Imports
import { useTranslation } from "react-i18next";
import { Box, Tab, Tabs } from "@mui/material";

const NetfreeTabs = ({ currentTab, handleTabChange }) => {
  const { t } = useTranslation();
  const NetfreePageTabs = [t("netfree.categories"), t("netfree.websites")];
  const defaultLanguageValue = localStorage.getItem("DEFAULT_LANGUAGE");

  return (
    <div className="m-5 px-2">
      <Box sx={{ borderBottom: 1, borderColor: "#E3E5E6" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          {NetfreePageTabs.map((tabItem, i) => {
            return (
              <Tab
                key={i}
                label={
                  <>
                    <h5 className="text-start text-[12px] capitalize md:text-[16px] -mb-1 font-normal w-[100%] flex items-center justify-between">
                      {tabItem}
                    </h5>
                  </>
                }
              />
            );
          })}
        </Tabs>
      </Box>
    </div>
  );
};

export default NetfreeTabs;
