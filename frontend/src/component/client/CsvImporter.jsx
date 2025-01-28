// React imports
import { useEffect, useState } from "react";

// CSS imports
import "react-csv-importer/dist/index.css";
import CrossIcon from "../../assets/images/cross.svg";
import CloudIcon from "../../assets/images/cloud.svg";

// Third part Imports
import { useTranslation } from "react-i18next";
import { Importer, ImporterField, enUS } from "react-csv-importer";
import { CSVLink } from "react-csv";

// API services
import clientsService from "../../services/clients";

// Icon imports
import { FaDownload } from "react-icons/fa";

// Utils imports
import { heIL } from "../../locales/reactCsvImporterHe";

function CsvImporter({ formFields, fetchClientsData, disabled }) {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isOpen, setIsOpen] = useState(false);
  const [errorEntries, setErrorEntries] = useState([]);

  const importClientsHandler = async (rows) => {
    try {
      const data = {
        clientsData: rows,
      };
      const res = await clientsService.importClients(data);
      fetchClientsData();
    } catch (error) {
      if (error?.response?.status === 422) {
        setErrorEntries(error.response.data?.errors);
      }
    }
  };

  const exportClientsSampleHandler = async () => {
    const res = await clientsService.exportSampleFormat();
    var url = "data:text/csv;charset=utf-8,%EF%BB%BF" + res.data;
    var a = document.createElement("a");
    a.href = url;
    a.download = "sample.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <button
        disabled={disabled}
        className={`w-[79px] disabled:cursor-not-allowed rounded-lg py-1 px-2 text-[14px] text-gray-11 font-medium dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6]`}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {t("clients.import")}
      </button>
      {isOpen ? (
        <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
            <div className="relative w-[90%] my-6 mx-auto max-w-[90%]">
              <div className="min-w-300px md:min-w-[400px] p-4 max-h-[90svh] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-between border-b border-b-[#E3E5E6] p-5 rounded-t mb-4">
                  <h3 className="text-xl font-medium">{t("netfree.Client")}</h3>

                  <img
                    src={CloudIcon}
                    alt="cloud-icon"
                    style={{
                      position: "absolute",
                      top:"42%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />

                  <button
                    className=""
                    onClick={() => {
                      setIsOpen(false);
                      setErrorEntries([]);
                    }}
                    type="button"
                  >
                    <img src={CrossIcon} alt="cross-icon" />
                  </button>
                </div>

                <Importer
                  locale={lang === "he" ? heIL : enUS}
                  skipEmptyLines={true}
                  dataHandler={async (rows, { startIndex }) => {
                    // required, may be called several times
                    // receives a list of parsed objects based on defined fields and user column mapping;
                    // (if this callback returns a promise, the widget will wait for it before parsing more data)
                    // mock timeout to simulate processing
                    await importClientsHandler(rows);
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
                    setErrorEntries([]);
                  }}
                >
                  {formFields.length > 0 &&
                    formFields.map((field, index) => {
                      return (
                        <ImporterField
                          key={index}
                          name={field?.field_slug}
                          label={field?.field_name}
                          optional={!field?.required}
                        />
                      );
                    })}
                </Importer>

                {errorEntries.length > 0 && (
                  <div className="w-full items-center flex flex-col my-4">
                    <p>{t("messages.importClientsError")}</p>

                    <button
                      className="text-red-500 my-2 background-transparent font-bold uppercase px-3 py-1 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                    >
                      <CSVLink
                        data={errorEntries}
                        filename={`${t("clients.errors")}.csv`}
                        target="_blank"
                      >
                        {t("clients.download")}
                      </CSVLink>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default CsvImporter;
