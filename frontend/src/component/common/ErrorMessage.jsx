import React from 'react'

function ErrorMessage({ message }) {
    return (
        <p className="my-1 text-[#ff0000]">{message}</p>
    )
}

export default ErrorMessage;