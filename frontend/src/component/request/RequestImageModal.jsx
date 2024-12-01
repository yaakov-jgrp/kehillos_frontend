import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { IoClose } from "react-icons/io5";

const TransparentImageModal = ({ showModal, setShowModal, imageSrc, loading, error }) => {
  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-transparent">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Transparent background */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />

            {/* Modal content */}
            <div className="relative w-11/12 md:w-3/5 lg:w-2/5 max-h-[80vh] flex flex-col items-center bg-transparent rounded-lg">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 bg-white rounded-full shadow-md p-1 hover:bg-gray-200"
                onClick={() => setShowModal(false)}
              >
                <img src={<IoClose />} alt="Close" className="h-6 w-6" />
              </button>

              {/* Content */}
              <div className="w-full h-full flex justify-center items-center p-4">
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <img
                    src={imageSrc}
                    alt="Screenshot"
                    className="rounded-lg border border-gray-300 max-w-full max-h-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default React.memo(TransparentImageModal);
