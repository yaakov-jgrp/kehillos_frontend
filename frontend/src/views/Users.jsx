// React imports
import React, { useState, useEffect, useContext } from "react";

// UI Imports
import { TablePagination } from "@mui/material";

// UI Components Imports
import AddButtonIcon from "../component/common/AddButton";
import SearchField from "../component/fields/SearchField";
import Loader from "../component/common/Loader";
import NoDataFound from "../component/common/NoDataFound";
import UserModal from "../component/Netfree/category/UserModal";
import DeleteConfirmationModal from "../component/common/DeleteConfirmationModal";

// Third part Imports
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// API services
import authService from "../services/auth";

// Icon imports
import { MdDelete, MdEdit } from "react-icons/md";
import AddIcon from "../assets/images/add.svg";
import BinIcon from "../assets/images/bin.svg";
import PencilIcon from "../assets/images/pencil.svg";

// Utils imports
import { paginationRowOptions } from "../lib/FieldConstants";
import { USER_DETAILS } from "../constants";
import { UserContext } from "../Hooks/permissionContext";

function Users() {
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const userTypes = [
    {
      label: t("users.admin"),
      value: "super_user",
    },
    {
      label: t("users.normal"),
      value: "normal_user",
    },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [userModal, setUserModal] = useState(false);
  const [newUser, setNewUser] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(100);
  const [searchParams, setSearchParams] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);
  const { userDetails, permissions } = useContext(UserContext);
  // const permissionsObjects =
  //   JSON.parse(localStorage.getItem("permissionsObjects")) || {};
  const usersPermission = permissions?.usersPermission;
  // const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
  const organizationAdmin = userDetails?.organization_admin;
  const writePermission = organizationAdmin
    ? false
    : usersPermission
    ? !usersPermission?.is_write
    : false;
  const updatePermission = organizationAdmin
    ? false
    : usersPermission
    ? !usersPermission?.is_update
    : false;
  const deletePermission = organizationAdmin
    ? false
    : usersPermission
    ? !usersPermission?.is_delete
    : false;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchUsersData = async () => {
    setIsLoading(true);
    try {
      let searchValues = "";
      for (const searchfield in searchParams) {
        if (searchParams[searchfield] !== "") {
          searchValues += `&search_${[searchfield]}=${
            searchParams[searchfield]
          }`;
        }
      }
      const params = `?page=${
        page + 1
      }&lang=${lang}&page_size=${rowsPerPage}${searchValues}`;
      const requestData = await authService.getUsers(params);
      setTotalCount(requestData?.data?.count);
      setAllUsers(requestData?.data?.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const searchResult = (searchBy, value) => {
    setSearchParams((prev) => ({ ...prev, ...{ [searchBy]: value } }));
  };

  const editUserHandler = (user) => {
    setNewUser(false);
    setEditUser(user);
    setUserModal(true);
  };

  const deleteUserHandler = async () => {
    try {
      const res = await authService.deleteUser(editUser?.id);
      if (res.status > 200) {
        toast.success(t("common.deleteSuccess"));
        fetchUsersData();
        setConfirmationModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const searchTimer = setTimeout(() => fetchUsersData(), 500);
    return () => clearTimeout(searchTimer);
  }, [lang, page, rowsPerPage, JSON.stringify(searchParams)]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-custom">
      <div className="flex justify-between items-center py-4 px-7 text-gray-11 font-medium text-2xl">
        {t("sidebar.users")}
        <button
          disabled={writePermission}
          className={`${
            lang === "he" ? "w-[150px]" : "w-[128px]"
          } disabled:cursor-not-allowed h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
          onClick={() => {
            setUserModal(true);
            setNewUser(true);
            setEditUser(null);
          }}
        >
          <img src={AddIcon} alt="add_icon" />
          {t("clients.AddNewUser")}
        </button>
      </div>
      <div className="h-[calc(100vh-210px)] overflow-y-auto overflow-x-auto mx-5 px-2">
        <table className="!table w-full text-[12px] md:text-[14px] mb-3">
          <thead className="sticky top-0 z-10 [&_th]:min-w-[8.5rem] bg-[#F9FBFC]">
            <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></div>
            <tr className="tracking-[-2%] mb-5">
              <th className="pr-3 pl-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("clients.id")}
                  id="userId"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("id", e.target.value)}
                  name="id"
                />
              </th>
              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("netfree.name")}
                  id="userName"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("name", e.target.value)}
                  name="name"
                />
              </th>
              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("netfree.email")}
                  id="userEmail"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("email", e.target.value)}
                  name="email"
                />
              </th>
              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("users.userType")}
                  id="user_type"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("user_type", e.target.value)}
                  name="user_type"
                />
              </th>
              <th className="pr-3 pb-2 pt-1">
                <div
                  className={`-mt-11 ${
                    i18n.dir() === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  <label
                    className={`truncate text-gray-11 ml-1.5 font-medium ${
                      lang === "he" ? "text-[16.5px]" : "text-[15px]"
                    }`}
                  >
                    {t("netfree.actions")}
                  </label>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="[&_td]:min-w-[9rem] [&_td]:max-w-[18rem]">
            {isLoading ? (
              <tr>
                <td colSpan="6">
                  <div className="h-[calc(100vh-210px)] w-full flex justify-center items-center">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {allUsers.length > 0 ? (
                  <>
                    {allUsers.map((el) => {
                      return (
                        <tr
                          className="h-[75px] border-b border-b-[#F2F2F2] py-12"
                          key={el.id}
                        >
                          <td>#{el.id}</td>
                          <td>{el.name}</td>
                          <td>{el.email}</td>
                          <td>
                            {
                              userTypes.filter(
                                (type) => type.value === el.user_type
                              )[0].label
                            }
                          </td>
                          <td>
                            <div className="h-auto w-full flex items-center justify-center gap-2">
                              <img
                                src={PencilIcon}
                                alt="PencilIcon"
                                className={updatePermission ? `hover:cursor-not-allowed` : `hover:cursor-pointer`}
                                onClick={updatePermission ? ()=>{} : () => {
                                  editUserHandler(el);
                                }}
                              />
                              <img
                                src={BinIcon}
                                alt="BinIcon"
                                className={deletePermission ? `hover:cursor-not-allowed` : `hover:cursor-pointer`}
                                onClick={deletePermission ? ()=>{} : () => {
                                  setEditUser(el);
                                  setConfirmationModal(true);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <tr className="h-[75px] text-center">
                    <td colSpan={6}>
                      <NoDataFound description={t("common.noDataFound")} />
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPageOptions={paginationRowOptions}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {userModal && (
        <UserModal
          showModal={userModal}
          setShowModal={setUserModal}
          user={editUser}
          newUser={newUser}
          userTypes={userTypes}
          onClick={() => {
            fetchUsersData();
          }}
        />
      )}
      {confirmationModal && editUser && (
        <DeleteConfirmationModal
          showModal={confirmationModal}
          setShowModal={setConfirmationModal}
          onClick={() => deleteUserHandler()}
        />
      )}
    </div>
  );
}

export default Users;
