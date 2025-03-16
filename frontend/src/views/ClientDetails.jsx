// React imports
import React, { useEffect, useState } from "react";

// UI Imports
import { Tabs, Tab, Box } from "@mui/material";

// UI Components Imports
import DetailsTabPanel from "../component/client/ClientTabPanels/DetailsTabPanel";
import RequestsTabPanel from "../component/client/ClientTabPanels/RequestsTabPanel";
import ClientNetfreeTabPanel from "../component/client/ClientTabPanels/ClientNetfreeTabPanel";
import Loader from "../component/common/Loader";
import ClientModal from "../component/client/ClientModal";
import DeleteConfirmationModal from "../component/common/DeleteConfirmationModal";

// Third part Imports
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import WhiteBin from "../assets/images/white_bin.svg";

// API services
import clientsService from "../services/clients";
import categoryService from "../services/category";

// Icon imports
import { MdDelete } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { ClientFormsTabPanel } from "../component/client/ClientTabPanels/ClientFormsTabPanel";
import { FULL_FORM_DATA, PROFILE_LIST, SINGLE_CLIENT_DATA, USER_DETAILS } from "../constants";
import ExportPdfPanelPdfme from "../component/client/ClientTabPanels/ExportPdfPanelPdfme";
import ExportPdfPanelUnlayer from "../component/client/ClientTabPanels/ExportPdfPanelUnlayer";

function ClientDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const permissionsObjects = JSON.parse(localStorage.getItem('permissionsObjects')) || {};
  const clientsPermission = permissionsObjects?.clientsPermission;
  const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
  const organizationAdmin = userDetails?.organization_admin;
  const tabs = [
    t("sidebar.details"),
    t("sidebar.netfree"),
    t("sidebar.request"),
    t("sidebar.forms"),
    t("sidebar.export1"),
    t("sidebar.export2"),
  ];
  const [isLoading, setIsloading] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [value, setValue] = useState(0);
  const [netfreeprofile, setNetfreeProfile] = useState(null);
  const [clientModal, setClientModal] = useState(false);
  const [netfreeprofiles, setNetfreeProfiles] = useState(null);
  const [fullFormData, setFullFormData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const deleteClientHandler = async (id) => {
    try {
      const res = await clientsService.deleteClient(id);
      if (res.status > 200) {
        navigate("/clients");
        toast.success(t("common.deleteSuccess"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getClientDataHandler = async () => {
    setIsloading(true);
    try {
      // ::REAL DATA::
      const profilesData = await categoryService.getProfilesListClientsPages();
      const netfreeProfiles = profilesData.data.data;
      clientsService
        .getClient(id)
        .then((res) => {
          setClientData(res.data);
          setIsloading(false);
          if (netfreeProfiles.length > 0) {
            const { netfree_profile } = res.data;
            const matchingProfile = netfreeProfiles.filter(
              (profile) => profile.id === netfree_profile
            )[0];
            setNetfreeProfile(matchingProfile);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsloading(false);
        });
      // ::MOCKED DATA::
      // const profilesData = PROFILE_LIST;
      // const res = SINGLE_CLIENT_DATA;
      // const netfreeProfiles = profilesData.data.data;
      // setClientData(res.data);
      // console.log("response data",res.data);  
      // setIsloading(false);
      // if (netfreeProfiles.length > 0) {
      //   const { netfree_profile } = res.data;
      //   const matchingProfile = netfreeProfiles.filter(
      //     (profile) => profile.id === netfree_profile
      //   )[0];
      //   setNetfreeProfile(matchingProfile);
      // }
    } catch (error) {
      console.log(err);
    }
  };

  const fetchNetfreeProfiles = async () => {
    // ::REAL DATA::
    const profilesListData = await categoryService.getProfilesListClientsPages();

    // ::MOCKED DATA::
    // const profilesListData = PROFILE_LIST;
    setNetfreeProfiles(profilesListData.data.data);
  };

  const fetchFullFormData = async () => {
    // ::REAL DATA::
    const formData = await clientsService.getFullformClientsPageData();

    // ::MOCKED DATA::
    // const formData = FULL_FORM_DATA;

    let formFields = [];
    formData.data.result.forEach((block) => {
      block.field.forEach((field) => {
        formFields.push(field);
      });
    });
    // Array of objects
    const arr = formFields.map((item) => {
      return {
        [item.field_slug]: item.display,
      };
    });
    setFullFormData(formFields);
    console.log(formFields);
  };

  useEffect(() => {
    fetchFullFormData();
    fetchNetfreeProfiles();
    getClientDataHandler();
  }, [lang]);


  return (
    <>
      <div className="w-full h-full bg-white rounded-3xl p-5 shadow-custom">
        {isLoading ? (
          <div className="h-[calc(100vh-210px)] w-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {clientData && !isLoading ? (
              <Box
                sx={{ width: "100%", height: "100%", overflow: "auto" }}
                className="scrollbar-hide"
              >
                {/* Top Tab Navigation  */}
                <Box sx={{ borderBottom: 1, borderColor: "#E3E5E6" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="basic tabs example"
                  >
                    {tabs.map((tabItem, i) => {
                      return (
                        <Tab
                          key={i}
                          label={
                            <>
                              <h5 className="text-start text-[12px] capitalize md:text-[16px] -mb-1 font-normal w-[100%] flex items-center justify-between">
                                {tabItem}
                              </h5>
                            </>
                          }
                        />
                      );
                    })}
                  </Tabs>
                </Box>

                {value === 0 && (
                  <>
                    <div className="flex p-2 gap-4 mt-4">
                      <div className="flex-[0.1]">
                        <div className="rounded-lg shadow-md w-[116px] h-[116px] flex justify-center items-center">
                          <FaUser color="lightgrey" size={80} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-[0.9] text-md">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-32">
                            <span className="font-normal text-gray-10 uppercase">
                              {t("clients.id")}
                            </span>
                            <p className="text-gray-11">
                              : {clientData?.client_id}
                            </p>
                          </div>

                          <div className="flex gap-11">
                            <span className="font-normal text-gray-10 capitalize">
                              {t("netfree.netfreeProfile")}
                            </span>
                            <div>
                              <p className="capitalize">
                                : {netfreeprofile?.name}
                              </p>
                              {netfreeprofile?.description !== "" && (
                                <p className="capitalize text-gray-11">
                                  ({netfreeprofile?.description})
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          {/* <MdEdit
                        className="text-blueSecondary mx-2 w-5 h-5 hover:cursor-pointer"
                        onClick={() => editClientHandler(clientData)}
                      /> */}
                          <button
                            disabled={organizationAdmin ? false : clientsPermission ? !clientsPermission?.is_delete : false}
                            className="text-white disabled:cursor-not-allowed text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none flex justify-center gap-2"
                            onClick={() => setConfirmationModal(true)}
                          >
                            <img src={WhiteBin} alt="WhiteBin" />
                            {t("netfree.deleteUser")}
                          </button>
                        </div>
                      </div>
                    </div>
                    <DetailsTabPanel
                      isLoading={isLoading}
                      clientData={clientData}
                      setClientData={setClientData}
                      value={value}
                      index={0}
                    />
                  </>
                )}

                {value === 1 && netfreeprofiles && (
                  <ClientNetfreeTabPanel
                    disabled={organizationAdmin ? false : clientsPermission ? !clientsPermission?.is_update : false}
                    isLoading={isLoading}
                    setNetfreeProfile={setNetfreeProfile}
                    clientData={clientData}
                    setClientData={setClientData}
                    netfreeprofile={netfreeprofile}
                    netfreeProfiles={netfreeprofiles}
                    value={value}
                    index={1}
                  />
                )}

                {value === 2 && (
                  <RequestsTabPanel id={id} value={value} index={2} />
                )}

                {value === 3 && <ClientFormsTabPanel disabled={organizationAdmin ? false : clientsPermission ? !clientsPermission?.is_write : false} clientId={id} />}
                {value === 4 && <ExportPdfPanelPdfme clientId={id} clientData={clientData} netfreeprofile={netfreeprofile} />}
                {value === 5 && <ExportPdfPanelUnlayer clientId={id} clientData={clientData} netfreeprofile={netfreeprofile} />}
              </Box>
            ) : (
              t("clients.noClientFound") + " " + id
            )}
          </>
        )}

        {netfreeprofiles && clientModal && (
          <ClientModal
            showModal={clientModal}
            setShowModal={setClientModal}
            newClient={false}
            client={clientData}
            netfreeProfiles={netfreeprofiles}
            fullFormData={fullFormData}
            onClick={() => {
              getClientDataHandler();
            }}
          />
        )}

        {confirmationModal && (
          <DeleteConfirmationModal
            showModal={confirmationModal}
            setShowModal={setConfirmationModal}
            onClick={() => deleteClientHandler(clientData?.client_id)}
          />
        )}
      </div>
    </>
  );
}

export default ClientDetails;
