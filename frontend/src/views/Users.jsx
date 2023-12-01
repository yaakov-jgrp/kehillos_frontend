import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AddButtonIcon from '../component/common/AddButton';
import authService from '../services/auth';
import SearchField from "../component/fields/SearchField";
import Loader from '../component/common/Loader';
import { TablePagination } from '@mui/material';
import NoDataFound from '../component/common/NoDataFound';
import { paginationRowOptions, searchFields } from '../lib/FieldConstants';
import {
    MdDelete,
    MdEdit
} from "react-icons/md";

function Users() {
    const { t, i18n } = useTranslation();
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    const [isLoading, setIsLoading] = useState(true);
    const [userModal, setUserModal] = useState(false);
    const [newUser, setNewUser] = useState(true);
    const [editUser, setEditUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [totalCount, setTotalCount] = useState(100);
    const [searchParams, setSearchParams] = useState(searchFields);


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
                    searchValues += `&search_${[searchfield]}=${searchParams[searchfield]}`
                };
            }
            const params = `?page=${page + 1}&lang=${lang}&page_size=${rowsPerPage}${searchValues}`;
            const requestData = await authService.getUsers(params);
            setTotalCount(requestData?.data?.count)
            setAllUsers(requestData?.data?.data);
            setTimeout(() => {
                setIsLoading(false);
            }, 500)
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const searchResult = (searchBy, value) => {
        setSearchParams((prev) => ({ ...prev, ...{ [searchBy]: value } }));
    }

    useEffect(() => {
        const searchTimer = setTimeout(() => fetchUsersData(), 500)
        return () => clearTimeout(searchTimer);
    }, [lang, page, rowsPerPage, JSON.stringify(searchParams)])

    return (
        <div className='w-full bg-white rounded-3xl'>
            <div className='flex justify-between py-4 px-7 font-bold text-[#2B3674]'>
                {t('sidebar.users')}
                <div className='flex max-w-[150px]'>
                    <AddButtonIcon extra={''} onClick={() => {
                        setUserModal(true);
                        setNewUser(true);
                        setEditUser(null);
                    }} />
                </div>
            </div>
            <div className='h-[calc(100vh-210px)] overflow-y-auto overflow-x-auto mx-5 px-2'>
                <table className='!table w-full text-[12px] md:text-[14px] mb-3'>
                    <thead className='sticky top-0 z-10 [&_th]:min-w-[8.5rem]'>
                        <tr className='tracking-[-2%] mb-5 bg-lightPrimary'>
                            <th className='pr-3'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('clients.id')}
                                    id="userId"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('id', e.target.value)}
                                    name="id"
                                />
                            </th>
                            <th className='pr-3'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('netfree.name')}
                                    id="userName"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('name', e.target.value)}
                                    name="name"
                                />
                            </th>
                            <th className='pr-3'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('netfree.email')}
                                    id="userEmail"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('email', e.target.value)}
                                    name="email"
                                />
                            </th>
                            <th className='pr-3'>
                                <div className={` ${(i18n.dir() === 'rtl') ? 'text-right' : 'text-left'}`}>
                                    <label
                                        className={`text-[10px] truncate md:text-[14px] text-navy-700 ml-1.5 font-medium
                                            `}
                                    >
                                        {t("netfree.actions")}
                                    </label>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='[&_td]:min-w-[9rem] [&_td]:max-w-[18rem]'>
                        {
                            isLoading ?
                                <tr>
                                    <td colSpan="6">
                                        <div className='h-[calc(100vh-210px)] w-full flex justify-center items-center'>
                                            <Loader />
                                        </div>
                                    </td>
                                </tr>
                                :
                                <>
                                    {
                                        allUsers.length > 0 ?
                                            <>
                                                {
                                                    allUsers.map((el) => {
                                                        return (
                                                            <tr className='h-[75px]' key={el.id}>
                                                                <td>#{el.id}</td>
                                                                <td>
                                                                    {el.name}
                                                                </td>
                                                                <td>
                                                                    {el.email}
                                                                </td>
                                                                <td>
                                                                    <div className="h-auto w-full flex items-center justify-around">
                                                                        <MdEdit className="text-blueSecondary w-5 h-5 hover:cursor-pointer" onClick={() => { }} />
                                                                        <MdDelete className="text-blueSecondary w-5 h-5 hover:cursor-pointer" onClick={() => { }} />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </> :
                                            <tr className='h-[75px] text-center'>
                                                <td colSpan={6}>
                                                    <NoDataFound description={t("common.noDataFound")} />
                                                </td>
                                            </tr>
                                    }
                                </>
                        }
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
        </div>
    )
}

export default Users