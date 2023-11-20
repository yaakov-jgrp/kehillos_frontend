import { GridToolbarQuickFilter } from '@mui/x-data-grid'
import React from 'react'

function DataGridSeachBar() {
    return (
        <GridToolbarQuickFilter sx={{
            width: "200px",
            margin: 1
        }} />
    )
}

export default DataGridSeachBar