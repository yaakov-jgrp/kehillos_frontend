// React imports
import { useEffect, useState } from "react";

// UI Components Imports
import Categories from "../component/Netfree/category/Index";
import Websites from "../component/Netfree/Websites";
import NetfreeTabs from "../component/Netfree/NetfreeTabs";

const NetFree = () => {
  const [tab, setTab] = useState(0);
  const [currentTab, setCurrentTab] = useState("categories");

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleTabChange = (tabValue) => {
    setCurrentTab(tabValue);
    localStorage.setItem("CURRENT_NETFREE_TAB", tabValue);
  };

  useEffect(() => {
    const currentTabValue = localStorage.getItem("CURRENT_NETFREE_TAB");
    if (currentTabValue) {
      setCurrentTab(currentTabValue);
    }
  }, []);

  return (
    <>
      <NetfreeTabs currentTab={tab} handleTabChange={handleChange} />

      {tab === 0 && (
        <Categories currentTab={tab} handleTabChange={handleChange} />
      )}

      {tab === 1 && (
        <Websites currentTab={currentTab} handleTabChange={handleChange} />
      )}
    </>
  );
};

export default NetFree;
