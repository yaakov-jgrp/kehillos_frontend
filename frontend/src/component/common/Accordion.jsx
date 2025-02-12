// React imports
import React from "react";

// UI Imports
import {
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";

// UI Components Imports
import AddButtonIcon from "./AddButton";
import RemoveButtonIcon from "./RemoveButton";

function CustomAccordion({ 
  title, 
  children, 
  onClick, 
  showAddButton, 
  writePermission,
  showRemoveButton,
  onRemove 
}) {
  return (
    <AccordionItem className="p-2 mb-4 rounded-lg bg-[#ffffff] border border-[#E3E5E6]">
      {({ isExpanded }) => (
        <>
          <AccordionButton as="p" className="py-2">
            <Box
              as="span"
              flex="1"
              textAlign="left"
              className="flex items-center justify-between px-2"
            >
              <p className="text-[20px] text-gray-11 font-medium capitalize">
                {title}
              </p>
              {isExpanded && (
                <div className="flex items-center gap-2">
                  {showAddButton && (
                    <AddButtonIcon disabled={writePermission} extra={""} onClick={onClick} />
                  )}
                  {showRemoveButton && (
                    <RemoveButtonIcon disabled={writePermission} extra={""} onClick={onRemove} />
                  )}
                </div>
              )}
            </Box>
            <AccordionIcon fontSize="1.5rem" />
          </AccordionButton>
          <AccordionPanel pb={4} className="py-4 border-t border-t-[#E3E5E6]">
            {children}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}

export default React.memo(CustomAccordion);
