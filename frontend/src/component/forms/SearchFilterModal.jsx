
import React, { useEffect, useState } from "react";
import CrossIcon from "../../assets/images/cross.svg";
import ToggleSwitch from "../common/ToggleSwitch";

export default function SearchFilterModal({ setShowFilterModal, activeSwitch, setActiveSwitch }) {
    const handleSwitchChange = (switchName) => {
      setActiveSwitch(switchName);
    };
  
    return (
      <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="min-w-300px md:min-w-[400px] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center justify-between border-b border-b-[#E3E5E6] p-5 rounded-t">
                <h3 className="text-lg font-medium">Filter Options</h3>
                <button onClick={() => setShowFilterModal(false)} type="button">
                  <img src={CrossIcon} alt="cross-icon" />
                </button>
              </div>
              <div className="relative p-6 flex-auto max-h-[calc(90vh-170px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <span>Name</span>
                  <ToggleSwitch
                    selected={activeSwitch === "name"}
                    clickHandler={() => handleSwitchChange("name")}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span>Email</span>
                  <ToggleSwitch
                    selected={activeSwitch === "email"}
                    clickHandler={() => handleSwitchChange("email")}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span>ID</span>
                  <ToggleSwitch
                    selected={activeSwitch === "id"}
                    clickHandler={() => handleSwitchChange("id")}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 my-8">
                <button
                  className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                >
                  Close
                </button>
                <button
                  className="text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }