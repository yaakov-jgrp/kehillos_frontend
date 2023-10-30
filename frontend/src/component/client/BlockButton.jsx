import React from 'react'

function BlockButton(props) {
    return (
        <button onClick={props.onClick} className={`p-2 w-[100%] ${props.active && 'bg-[#E7F1FF] rounded-md border-solid border-l-4 border-l-[#3978fe]'}`}>{props.children ? props.children : "button"}</button>
    )
}

export default BlockButton