import React from 'react'
import { BsPencilSquare } from "react-icons/bs";

const EditButtonIcon = (props) => {
    const { extra } = props
    return (
        <button>
            <BsPencilSquare className={`${extra} w-3 h-3 hover:cursor-pointer`} onClick={props.onClick} />
        </button>
    )
}

export default EditButtonIcon
