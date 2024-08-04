import React, { useEffect, useState } from "react";
import CrossIcon from "../../assets/images/cross.svg";
import { useTranslation } from "react-i18next";
import { MenuItem, Select } from "@mui/material";
import clientsService from "../../services/clients";
import { useSelector } from "react-redux";
import { Accordion } from "@chakra-ui/react";
import CustomAccordion from "../common/Accordion";
import CustomField from "../fields/CustomField";
import { checkBoxConstants } from "../../lib/FieldConstants";

export default function CreateClientFormModal({ setShowModal }) {
  const { t } = useTranslation();

  // State for select inputs
  const [activeFormState, setActiveFormState] = useState(null);
  const [clientValue, setClientValue] = useState("");
  const [formId, setFormId] = useState("");
  const [allClients, setAllClients] = useState([]);
  const allForms = useSelector((state) => state.allFormsState.allForms);

  useEffect(() => {
    const fetchClientsData = async () => {
      const params = `?page=${1}&lang=${"en"}&page_size=${50}`;
      const clientsData = await clientsService.getClients(params);
      setAllClients(clientsData.data.data);
    };

    fetchClientsData();
  }, []);

  useEffect(() => {
    setActiveFormState(allForms.filter((form) => form.id === formId)[0]);
  }, [formId]);

  return (
    <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-7xl">
          <div className="scrollbar-hide w-[60vw] h-[35rem] overflow-y-auto border-0 rounded-xl shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between border-b border-b-[#E3E5E6] rounded-t px-4 py-2">
              <h3 className="text-lg font-medium">{t("forms.addNewForm")}</h3>
              <button
                className=""
                onClick={() => setShowModal(false)}
                type="button"
              >
                <img src={CrossIcon} alt="cross-icon" />
              </button>
            </div>

            <div className="bg-[#F9FBFC] rounded-lg m-4 px-4 pt-4">
              <div className="flex items-center gap-2 w-full border-b border-b-[#E3E5E6] pb-4">
                <div className="w-full">
                  <p>{t("forms.client")}</p>
                  <Select
                    labelId="client-select-label"
                    id="client-select"
                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                    value={clientValue}
                    MenuProps={{
                      sx: {
                        maxHeight: "250px",
                        zIndex: 13000,
                      },
                    }}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setClientValue(e.target.value);
                    }}
                    placeholder="Choose client"
                  >
                    <MenuItem key="select" value="select" disabled>
                      Select
                    </MenuItem>
                    {allClients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        #{client.id} {client.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="w-full">
                  <p>{t("forms.form")}</p>
                  <Select
                    labelId="form-select-label"
                    id="form-select"
                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                    value={formId}
                    MenuProps={{
                      sx: {
                        maxHeight: "250px",
                        zIndex: 13000,
                      },
                    }}
                    onChange={(e) => {
                      setFormId(e.target.value);
                    }}
                    placeholder="Choose form"
                  >
                    <MenuItem key="select" value="select" disabled>
                      Select
                    </MenuItem>
                    {allForms.map((form) => (
                      <MenuItem key={form.id} value={form.id}>
                        {form.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4">
              {activeFormState &&
                Object.keys(activeFormState).length > 0 &&
                activeFormState.blocks.length > 0 && (
                  <Accordion
                    defaultIndex={Array.from(
                      { length: activeFormState.blocks?.length },
                      (x, i) => i
                    )}
                    allowMultiple
                  >
                    {activeFormState.blocks.map((blockData, index) => (
                      <CustomAccordion
                        key={index}
                        showAddButton={false}
                        title={blockData.name}
                        onClick={() => {
                          addBlockFieldModalHandler(false, blockData.id);
                        }}
                      >
                        {activeFormState.fields.length > 0 ? (
                          <div className="grid grid-cols-3 gap-4">
                            {activeFormState.fields
                              .filter((field) => field.blockId === blockData.id)
                              .map((field, index) => {
                                const isCheckBox = checkBoxConstants.includes(
                                  field.data_type.value
                                );
                                return (
                                  <div
                                    className="mb-2 px-2 flex flex-col gap-1"
                                    key={index}
                                  >
                                    <div
                                      className={`flex items-center justify-between ${
                                        isCheckBox ? "ml-2 w-full" : "mb-1"
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        <label className="block text-gray-700 text-md font-normal">
                                          {field.name}
                                        </label>
                                        <p className="text-md mx-1 capitalize text-gray-600 font-normal">{`(${field.data_type.value})`}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <CustomField
                                        value={field?.defaultvalue}
                                        field={field}
                                        onChange={(e) => {
                                          console.log(e.target.value);
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <p className="px-2">{t("clients.noFields")}</p>
                        )}
                      </CustomAccordion>
                    ))}
                  </Accordion>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
