import React from 'react';
import { AccordionItem, AccordionButton, Box, AccordionIcon, AccordionPanel } from '@chakra-ui/react'
import AddButtonIcon from './AddButton';

function CustomAccordion({ data, onClick }) {
    return (
        <AccordionItem className='p-2 mb-4 rounded-md bg-[#ffffff] shadow-lg'>
            {({ isExpanded }) => (
                <>
                    <AccordionButton as="p" className='py-2'>
                        <Box as="span" flex='1' fontSize='1.3rem' textAlign='left' className='flex items-center justify-between'>
                            {data.block}
                            {
                                isExpanded && <AddButtonIcon extra={''} onClick={onClick} />
                            }
                        </Box>
                        <AccordionIcon fontSize='1.5rem' />
                    </AccordionButton>
                    <AccordionPanel pb={4} className='border-t py-2 border-gray-400'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    )
}

export default React.memo(CustomAccordion);