import React from "react";

// Utils imports

// Third part Imports
import { useTranslation } from "react-i18next";
import { Box, Tab, Tabs } from "@mui/material";

const NetfreeTabs = ({ currentTab, handleTabChange, tabsArray }) => {
  const { t } = useTranslation();
  const defaultLanguageValue = localStorage.getItem("DEFAULT_LANGUAGE");

  return (
    <Box sx={{ borderBottom: 1, borderColor: "#E3E5E6" }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="basic tabs example"
      >
        {tabsArray.map((tabItem, i) => {
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
  );
};

export default NetfreeTabs;
