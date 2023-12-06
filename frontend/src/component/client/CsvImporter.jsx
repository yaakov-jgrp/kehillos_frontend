import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Importer, ImporterField, enUS } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';
import { heIL } from "../../locales/reactCsvImporterHe";
import clientsService from "../../services/clients";
import { errorsToastHandler } from "../../lib/CommonFunctions";

function CsvImporter({ formFields, fetchClientsData }) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");

    const importClientsHandler = async (data) => {
        clientsService.importClients(data).then((res) => {
            toast.success("Import successfully done");
            fetchClientsData();
            setIsOpen(false)
        }).catch((err) => {
            errorsToastHandler(err.response.data.error);
        });
    }


    return (
        <>
            <label onClick={() => { setIsOpen(true) }} className={`w-full rounded-full py-1 px-4 mx-1 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}>
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
                                    locale={lang === "he" ? heIL : enUS}
                                    dataHandler={async (rows, { startIndex }) => {
                                        // required, may be called several times
                                        // receives a list of parsed objects based on defined fields and user column mapping;
                                        // (if this callback returns a promise, the widget will wait for it before parsing more data)
                                        // mock timeout to simulate processing
                                        const data = {
                                            clientsData: rows
                                        }
                                        importClientsHandler(data);
                                    }}
                                    defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
                                    restartable={false} // optional, lets user choose to upload another file when import is complete
                                    onStart={({ file, preview, fields, columnFields }) => {
                                        // optional, invoked when user has mapped columns and started import
                                        // prepMyAppForIncomingData();
                                    }}
                                    onComplete={({ file, preview, fields, columnFields }) => {
                                        // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
                                        // showMyAppToastNotification();
                                        // console.log(file, preview, fields, columnFields);
                                    }}
                                    onClose={({ file, preview, fields, columnFields }) => {
                                        // optional, if this is specified the user will see a "Finish" button after import is done,
                                        // which will call this when clicked
                                        // goToMyAppNextPage();
                                        // console.log(file, preview, fields, columnFields);
                                        setIsOpen(false);
                                    }}
                                >
                                    {
                                        formFields.map((field, index) => {
                                            return (
                                                <ImporterField key={index} name={field?.field_slug} label={lang === "he" ? field?.name_he : field?.field_name} optional={!field?.required} />
                                            )
                                        })
                                    }
                                </Importer>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default CsvImporter