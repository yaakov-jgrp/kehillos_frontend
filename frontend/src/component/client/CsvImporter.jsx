import { useState } from "react";
import Importer from 'react-importer';
import { useTranslation } from "react-i18next";

function CsvImporter() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <label onClick={() => setIsOpen(true)} className={`w-full rounded-full py-1 px-4 mr-1 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}>
                {t("clients.import")}
            </label>
            {isOpen ? (
                <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
                        <div className="relative w-[90%] my-6 mx-auto max-w-[90%]">
                            <div className="min-w-300px md:min-w-[400px] p-4 max-h-[90svh] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                    <h3 className="text-2xl font-semibold">{t('netfree.addClient')}</h3>
                                    <button
                                        className="bg-transparent border-0 text-black float-right"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-black opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                                            x
                                        </span>
                                    </button>
                                </div>
                                <Importer
                                    fields={[
                                        {
                                            label: "Name", key: "name", validators: [
                                                { validate: "required" },
                                            ]
                                        },
                                        {
                                            label: "Email", key: "email", validators: [
                                                { validate: "required" },
                                                { validate: "unique", error: "This email is not unique" },
                                            ]
                                        },
                                        {
                                            label: "State", key: "state", transformers: [
                                                { transformer: "state_code" }
                                            ]
                                        },
                                    ]}
                                    onComplete={(data) => {
                                        console.log(data)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default CsvImporter