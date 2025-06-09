import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import WorkflowModal from "./WorkflowModal";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import workflowRulesServices from "../../../../services/workflowRules";

// UI Components Imports
import SearchField from "../../../fields/SearchField";
import EditButtonIcon from "../../../common/EditButton";
import Loader from "../../../common/Loader";
import DeleteConfirmationModal from "../../../common/DeleteConfirmationModal";
import { toast } from "react-toastify";

// Icon imports
import BinIcon from "../../../../assets/images/bin.svg";
import { useSearch } from "../../../../Hooks/useSearch";

const Workflows = () => {
  const { t } = useTranslation();
  const [editWorkflow, setEditWorkflow] = useState(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [workflow, setWorkflow] = useState(null);
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  const {
    data: workflowsData,
    isFetching: isFetchingWorkflows,
    refetch,
  } = useQuery({
    queryKey: ["workflowList"],
    queryFn: () => workflowRulesServices.getWorkflows(),
    placeholderData: keepPreviousData,
  });

  const { mutate: deleteWorkflowHandler, isPending: isDeletingWorkflow } =
    useMutation({
      mutationKey: ["deleteworkflow"],
      mutationFn: () => workflowRulesServices.deleteWorkflow(workflow.id),
      onSuccess: () => {
        setConfirmationModal(false);
        setWorkflow(null);
        toast.success(t("messages.workflowDeleteSuccess"));
        refetch();
      },
      onError: () => {
        toast.error(t("messages.workflowDeleteError"));
      },
    });
  const { searchQuery, setSearchQuery, filteredItems } = useSearch(
    workflowsData?.data ?? [],
    ["workflow_name", "workflow_type", "frequency"],
    300
  );

  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-end w-full mb-4">
        <SearchField
          variant="auth"
          type="text"
          value={searchQuery}
          placeholder={t("searchbox.placeHolder")}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          name="name"
        />
        <button
          className={`disabled:cursor-not-allowed w-fit mb-2 ml-auto rounded-lg py-2 px-4 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
          onClick={() => {
            setEditWorkflow(null);
            setShowWorkflowModal(!showWorkflowModal);
          }}
        >
          {t("netfree.addWorkflow")}
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-auto mb-12 w-full h-[30rem]">
        {isFetchingWorkflows && (
          <div className="h-full w-full flex justify-center items-center">
            <Loader />
          </div>
        )}
        <table className="!table text-[12px] overflow-y-auto w-full">
          <thead className="sticky top-0 z-10 bg-[#F9FBFC]">
            <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></div>
            <tr className=" pr-3 rounded-lg mb-5">
              <th className="px-1 w-[15rem] pl-2 pt-2 pb-4">
                <p
                  className={`text-start text-gray-11 font-medium ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("automation.workflowName")}
                </p>
              </th>
              <th className="pl-5 pt-2 pb-4">
                <p
                  className={`text-start text-gray-11 font-medium ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("automation.workflowType")}
                </p>
              </th>
              <th className="pl-5 pt-2 pb-4">
                <p
                  className={`text-start text-gray-11 font-medium ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("automation.frequency")}
                </p>
              </th>
            </tr>
          </thead>
          <tbody className="pt-5">
            {!isFetchingWorkflows && workflowsData.data.length > 0
              ? filteredItems.map((el, currentIndex) => {
                  return (
                    <tr
                      className="h-[20px] border-t bottom-b border-sky-500 w-[100%]"
                      key={el.id}
                    >
                      <td className="py-5">
                        <p className="font-normal text-gray-11 break-words w-[18rem]">
                          {el.workflow_name}
                        </p>
                      </td>
                      <td className="py-5 min-w-[16rem] max-w-[24rem] flex gap-x-3">
                        <p className="font-normal text-gray-11 break-words w-[18rem]">
                          {el.workflow_type === "open" ? (
                            <>{t("automation.open")}</>
                          ) : (
                            <>{t("automation.close")}</>
                          )}
                        </p>
                      </td>
                      <td className="py-5 min-w-[16rem] max-w-[24rem] flex gap-x-3">
                        <p className="font-normal text-gray-11 break-words w-[18rem]">
                          {el.frequency === "once" ? (
                            <>{t("automation.once")}</>
                          ) : (
                            <>{t("automation.twice")}</>
                          )}
                        </p>
                        <div className="flex justify-between">
                          <div className="flex items-center justify-center">
                            <EditButtonIcon
                              extra={`mx-2 justify-self-end cursor-pointer`}
                              onClick={() => {
                                setEditWorkflow(el);
                                setShowWorkflowModal(true);
                              }}
                            />
                            <img
                              src={BinIcon}
                              alt="BinIcon"
                              onClick={() => {
                                setConfirmationModal(true);
                                setWorkflow(el);
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
      {showWorkflowModal && (
        <WorkflowModal
          setShowModal={setShowWorkflowModal}
          editWorkflow={editWorkflow}
          setEditWorkflow={setEditWorkflow}
          onClick={() => {}}
          refetchWorkflows={refetch}
        />
      )}
      {confirmationModal && workflow && (
        <DeleteConfirmationModal
          showModal={confirmationModal}
          setShowModal={setConfirmationModal}
          onClick={() => deleteWorkflowHandler()}
        />
      )}
    </div>
  );
};

export default Workflows;
