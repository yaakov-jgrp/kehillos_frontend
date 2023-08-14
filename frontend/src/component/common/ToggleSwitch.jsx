import React, { useState } from 'react';

const ToggleSwitch = (props) => {
    const { selected } = props
    const [checked, setChecked] = useState(selected || false);
    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <label className="flex items-center cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={handleChange}
                />
                <div className={`w-10 h-4 ${checked ? 'bg-blueSecondary' : 'bg-gray-300'} rounded-full shadow-inner`}></div>
                <div
                    className={`absolute w-3 h-3 bg-white rounded-full shadow inset-y-0 left-0 ${checked ? 'translate-x-6' : 'translate-x-1'
                        } transition-transform duration-200 transform -translate-y-1/2 top-1/2`}
                ></div>
            </div>
        </label>
    );
};

export default ToggleSwitch;