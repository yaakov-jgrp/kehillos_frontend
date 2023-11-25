import React from 'react'

function FieldLabel({ children, className }) {
    return (
        <label className={`block break-words text-black text-end text-md font-semibold ${className}`}>
            {children}
        </label>
    )
}

export default FieldLabel