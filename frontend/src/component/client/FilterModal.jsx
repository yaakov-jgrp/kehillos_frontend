import React from 'react'
import { useTranslation } from "react-i18next";
import NoDataFound from '../common/NoDataFound';
import EditButtonIcon from '../common/EditButton';
import { MdDelete } from 'react-icons/md';

function FilterModal({ showModal, setShowModal, fullFormData, filters }) {
    const { t } = useTranslation();
    return (
        <>
            {showModal ? (
                <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-7xl">
                            <div className="w-[100%] min-w-[80vw] md:min-w-[70vw] lg:min-w-[60vw] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 shadow-md rounded-t ">
                                    <h3 className="text-2xl font-semibold">{t('clients.filters')}</h3>
                                    <button
                                        className="bg-transparent border-0 text-black float-right"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="text-black opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                                            x
                                        </span>
                                    </button>
                                </div>
                                {
                                    filters.length > 0 ?
                                        <>
                                            {
                                                filters.map((filter, i) => {
                                                    return (
                                                        <div className="flex items-start justify-between p-6 border-solid  rounded-t ">
                                                            {filter.name}
                                                            <div className='flex items-center'>
                                                                {
                                                                    filter?.fg_default ?
                                                                        <button
                                                                            className="text-red-500 background-transparent font-semibold uppercase px-3 py-1 text-sm outline-none focus:outline-none"
                                                                            type="submit"
                                                                        >
                                                                            {t("netfree.remove")}
                                                                        </button> :
                                                                        <button
                                                                            className="text-white text-[14px] font-small transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 uppercase px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                                                                            type="submit"
                                                                        >
                                                                            {t("clients.apply")}
                                                                        </button>
                                                                }
                                                                <EditButtonIcon extra="ml-2" />
                                                                <MdDelete className="ml-2 text-blueSecondary w-4 h-4 hover:cursor-pointer" />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </> : <NoDataFound description="No filters found" />
                                }
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        {t('netfree.close')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default FilterModal;