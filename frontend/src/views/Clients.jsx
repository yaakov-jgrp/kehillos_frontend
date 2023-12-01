import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Loader from '../component/common/Loader';
import clientsService from '../services/clients';
import AddButtonIcon from '../component/common/AddButton';
import categoryService from '../services/category';
import ClientModal from '../component/client/ClientModal';
import ErrorsModal from '../component/common/ErrorsModal';
import CsvImporter from '../component/client/CsvImporter';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import DisplayFieldsModal from '../component/client/DisplayFieldsModal';
import { NumberFieldConstants, dateRegex, paginationRowOptions } from '../lib/FieldConstants';
import SearchField from '../component/fields/SearchField';
import { TablePagination } from '@mui/material';
import { FaFilter } from "react-icons/fa";
import FilterModal from '../component/client/FilterModal';
import NoDataFound from '../component/common/NoDataFound';

const Clients = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    dayjs.extend(utc);
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    const [isLoading, setIsLoading] = useState(true);
    const [allClients, setAllClients] = useState([]);
    const [clientModal, setClientModal] = useState(false);
    const [newClient, setNewClient] = useState(true);
    const [editClient, setEditClient] = useState({});
    const [netfreeprofiles, setNetfreeProfiles] = useState(null);
    const [importErrors, setImportErrors] = useState([]);
    const [errorModal, setErrorModal] = useState(false);
    const [fullFormData, setFullFormData] = useState(null);
    const [showDisplayModal, setShowDisplayModal] = useState(false);
    const [displayFields, setDisplayFields] = useState([]);
    const [displayFormValues, setDisplayFormValues] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [totalCount, setTotalCount] = useState(100);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchParams, setSearchParams] = useState({});
    const [filters, setFilters] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchFiltersHandler = async () => {
        try {
            const response = await clientsService.getClientFilters();
            setFilters(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const fetchClientsData = async () => {
        setIsLoading(true);
        try {
            const filters = await fetchFiltersHandler();
            const defaultFilter = filters?.filter((filter) => filter.fg_default);
            const filterParams = defaultFilter.length > 0 ? `&filter_ids=${defaultFilter[0].id}` : "";
            let searchValues = "";
            for (const searchfield in searchParams) {
                if (searchParams[searchfield] !== "") {
                    searchValues += `&search_${[searchfield]}=${searchParams[searchfield]}`
                };
            }
            const params = `?page=${page + 1}&lang=${lang}&page_size=${rowsPerPage}${searchValues}${filterParams}`;
            const clientsData = await clientsService.getClients(params);
            setTotalCount(clientsData.data.count);
            setAllClients(clientsData?.data?.data);
            if (clientsData?.data?.data.length > 0) {
                setEditClient(clientsData?.data?.data[0]);
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const fetchFullFormData = async () => {
        try {
            const formData = await clientsService.getFullformData();
            let formFields = [];
            formData.data.result.forEach((block) => {
                block.field.forEach((field) => {
                    formFields.push(field);
                })
            });
            // Array of objects
            const arr = formFields.map((item) => {
                return {
                    [item.field_slug]: item.display
                }
            });
            // Combine all objects into a single object
            const result = arr.reduce((acc, curr) => Object.assign(acc, curr), {});
            const searchFields = arr.reduce((acc, curr) => {
                Object.keys(curr).forEach(key => {
                    acc[key] = '';
                });
                return acc;
            }, {});
            setSearchParams(searchFields)
            setDisplayFormValues(result);
            setDisplayFields(formFields);
            setFullFormData(formFields);
        } catch (error) {
            console.log(error)
        }
    }

    const searchResult = (searchBy, value) => {
        setSearchParams((prev) => ({ ...prev, ...{ [searchBy]: value } }));
    }

    const fetchNetfreeProfiles = async () => {
        const profilesListData = await categoryService.getProfilesList();
        setNetfreeProfiles(profilesListData.data.data);
    }

    const exportClientsHandler = async () => {
        const res = await clientsService.exportClients();
        var url = "data:text/csv;charset=utf-8,%EF%BB%BF" + res.data;
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Clients.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    const handleRowClick = (id) => {
        navigate(`/clients/${id}`);
    }

    useEffect(() => {
        const searchTimer = setTimeout(() => {
            fetchClientsData();
            fetchNetfreeProfiles();
        }, 500)
        return () => clearTimeout(searchTimer);
    }, [page, rowsPerPage, lang, JSON.stringify(searchParams)]);

    useEffect(() => {
        fetchFullFormData();
    }, [])

    return (
        <div className='w-full bg-white rounded-3xl'>
            {allClients && netfreeprofiles && editClient && clientModal &&
                <ClientModal
                    showModal={clientModal}
                    setShowModal={setClientModal}
                    newClient={newClient}
                    client={editClient}
                    netfreeProfiles={netfreeprofiles}
                    fullFormData={fullFormData}
                    onClick={() => { setNewClient(true); fetchClientsData(); }}
                />}
            {importErrors.length > 0 &&
                <ErrorsModal
                    errors={importErrors}
                    showModal={errorModal}
                    setShowModal={setErrorModal}
                />
            }
            <div className='flex justify-between py-4 px-7 font-bold text-[#2B3674]'>
                {t('clients.title')}
                <div className='flex max-w-[350px]'>
                    <AddButtonIcon extra={''} onClick={() => {
                        setNewClient(true);
                        setClientModal(true);
                    }} />
                    <label className={`w-fit rounded-full flex items-center py-1 px-3 mr-1 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`} onClick={() => setShowFilterModal(!showFilterModal)}>
                        <FaFilter className={`rounded-full text-white mr-1 w-3 h-3 hover:cursor-pointer`} />
                        {t("clients.filters")}
                    </label>
                    <label className={`w-fit rounded-full flex items-center py-1 px-3 mr-1 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`} onClick={() => setShowDisplayModal(!showDisplayModal)}>
                        {t("clients.visibility")}
                        <FiSettings className={`rounded-full text-white ml-1 w-3 h-3 hover:cursor-pointer`} />
                    </label>
                    <CsvImporter formFields={fullFormData} fetchClientsData={fetchClientsData} />
                    <button className={`w-full rounded-full py-1 px-4 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
                        onClick={exportClientsHandler}>
                        {t("clients.export")}
                    </button>
                </div>
            </div>
            <div className='h-[calc(100vh-210px)] overflow-y-auto overflow-x-auto mx-5 px-2'>
                <table className='!table text-[12px] md:text-[14px] min-w-[100%] mb-3'>
                    {fullFormData && fullFormData.length > 0 &&
                        <thead className='sticky top-0 z-10 [&_th]:min-w-[8.5rem]'>
                            <tr className='tracking-[-2%] mb-5 bg-lightPrimary'>
                                <th className='pr-3'>
                                    <SearchField
                                        variant="auth"
                                        extra="mb-2"
                                        label={t("clients.id")}
                                        id="field_id"
                                        type="text"
                                        placeholder={t('searchbox.placeHolder')}
                                        onChange={(e) => searchResult("id", e.target.value)}
                                        name="id"
                                    />
                                </th>
                                {
                                    fullFormData.map((field, i) => {
                                        return (
                                            <Fragment key={i}>
                                                {
                                                    field?.display &&
                                                    <th className='pr-3'>
                                                        <SearchField
                                                            variant="auth"
                                                            extra="mb-2"
                                                            label={lang === "he" ? field?.field_name_language.he : field?.field_name}
                                                            id={field?.id}
                                                            type="text"
                                                            placeholder={t('searchbox.placeHolder')}
                                                            onChange={(e) => searchResult(field?.field_slug, e.target.value)}
                                                            name={field?.field_slug}
                                                        />
                                                    </th>
                                                }
                                            </Fragment>
                                        )
                                    })}
                            </tr>
                        </thead>}
                    <tbody className='[&_td]:min-w-[9rem]'>
                        {
                            isLoading ?
                                <tr>
                                    <td colSpan={fullFormData?.length + 1 || 6}>
                                        <div className='h-[calc(100vh-310px)] w-full flex justify-center items-center'>
                                            <Loader />
                                        </div>
                                    </td>
                                </tr>
                                :
                                <>
                                    {
                                        allClients?.length > 0 ?
                                            <>
                                                {
                                                    allClients.length > 0 && allClients.map((client, i) => {
                                                        return (
                                                            <tr className='h-[75px] cursor-pointer' key={client.id}>
                                                                <td onClick={() => { handleRowClick(client?.id) }}>
                                                                    #{client?.id}
                                                                </td>
                                                                {fullFormData?.length > 0 && fullFormData.map((field, i) => {
                                                                    const dataValue = client[field?.field_slug];
                                                                    const value = typeof dataValue === "object" ? field?.data_type.value === "file" ? dataValue.file_name.split("upload/")[1] : dataValue?.value : typeof dataValue === "boolean" ? JSON.stringify(dataValue) : dataValue;
                                                                    let isDate = false;
                                                                    const isNumber = NumberFieldConstants.includes(field?.data_type.value);
                                                                    const emptyValues = ["", null];
                                                                    if (dateRegex.test(value)) {
                                                                        isDate = true;
                                                                    }

                                                                    return (
                                                                        <Fragment key={i}>
                                                                            {
                                                                                field?.display && <td key={i} onClick={() => { handleRowClick(client?.id) }}>
                                                                                    {
                                                                                        emptyValues.includes(value) ? <p>{t("clients.noValueFound")}</p> :
                                                                                            <>
                                                                                                {
                                                                                                    isDate ? <p>{dayjs(value).format("DD/MM/YYYY")}</p> : <p>{isNumber ? parseFloat(value) : value}</p>
                                                                                                }
                                                                                            </>
                                                                                    }
                                                                                </td>
                                                                            }
                                                                        </Fragment>
                                                                    )
                                                                })}
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </> :
                                            <tr className='h-[75px] text-center'>
                                                <td colSpan={fullFormData?.length + 1 || 6}>
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
                onPageChange={handleChangePage}
                rowsPerPageOptions={paginationRowOptions}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {
                showDisplayModal &&
                <DisplayFieldsModal
                    formValues={displayFormValues}
                    displayFields={displayFields}
                    onClick={() => {
                        fetchFullFormData();
                        fetchClientsData();
                    }}
                    showModal={showDisplayModal}
                    setShowModal={setShowDisplayModal}
                />
            }
            {
                showFilterModal &&
                <FilterModal
                    fetchClientsData={fetchClientsData}
                    fullFormData={fullFormData}
                    filters={filters}
                    showModal={showFilterModal}
                    setShowModal={setShowFilterModal}
                />
            }
        </div>
    )
}

export default Clients
