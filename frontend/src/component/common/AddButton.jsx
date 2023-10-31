import React from 'react'
import { BsPlusCircleFill } from "react-icons/bs";

const AddButtonIcon = (props) => {
    const { extra } = props
    return (
        <button className='bg-[#F4F7FE] rounded-full p-1' onClick={props.onClick}>
            <BsPlusCircleFill className={`${extra} bg-white rounded-full text-blueSecondary w-5 h-5 hover:cursor-pointer`} />
        </button>
    )
}

export default AddButtonIcon
