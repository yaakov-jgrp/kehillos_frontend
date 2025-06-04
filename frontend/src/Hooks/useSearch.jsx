import { useState, useEffect, useRef } from "react";
import debounce from "lodash/debounce";

export const useSearch = (items, searchFields, delay = 300) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  const debouncedFilterRef = useRef(
    debounce((query, itemList) => {
      const lowerQuery = query.toLowerCase();
      const filtered = itemList.filter((item) => {
        if (!lowerQuery) return true;
        return searchFields.some((field) =>
          item[field]?.toLowerCase().includes(lowerQuery)
        );
      });
      setFilteredItems(filtered);
    }, delay)
  );

  useEffect(() => {
    debouncedFilterRef.current(searchQuery, items);
  }, [searchQuery, items]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFilterRef.current.cancel();
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
  };
};
