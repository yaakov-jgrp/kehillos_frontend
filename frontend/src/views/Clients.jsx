import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Loader from '../component/common/Loader';
import clientsService from '../services/clients';
import AddButtonIcon from '../component/common/AddButton';
import categoryService from '../services/category';
import ClientModal from '../component/client/ClientModal';
import {
    MdDelete,
    MdEdit
} from "react-icons/md";
import ErrorsModal from '../component/common/ErrorsModal';
import CsvImporter from '../component/client/CsvImporter';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import DisplayFieldsModal from '../component/client/DisplayFieldsModal';
import { fetchFullformDataHandler } from '../lib/CommonFunctions';
import { NumberFieldConstants, dateRegex } from '../lib/FieldConstants';
import DataGridSeachBar from '../component/client/DataGridSeachBar';

const Clients = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    dayjs.extend(utc);
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    const [isLoading, setIsLoading] = useState(false);
    const [allClients, setAllClients] = useState([]);
    const [clientModal, setClientModal] = useState(false);
    const [newClient, setNewClient] = useState(true);
    const [editClient, setEditClient] = useState({});
    const [netfreeprofiles, setNetfreeProfiles] = useState(null);
    const [importErrors, setImportErrors] = useState([]);
    const [errorModal, setErrorModal] = useState(false);
    const [fullFormData, setFullFormData] = useState(null);
    const [columns, setColumns] = useState(null);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [totalRows, setTotalRows] = useState(0);
    const [showDisplayModal, setShowDisplayModal] = useState(false);
    const [displayFields, setDisplayFields] = useState([]);
    const [displayFormValues, setDisplayFormValues] = useState({});

    const fetchClientsData = async () => {
        setIsLoading(true);
        const clientsData = await clientsService.getClients(paginationModel.page + 1);
        const formData = await clientsService.getFullformData();
        let formFields = [];
        let columnsData = [];
        formData.data.result.forEach((block) => {
            block.field.forEach((field) => {
                formFields.push(field);
            })
        });
        columnsData.push({
            field: "id",
            headerName: t("clients.id"),
            flex: 1,
            minWidth: 100,
        });
        setTotalRows(clientsData.data.count);
        clientsData.data.field.forEach((item, i) => {
            const column = {
                field: Object.keys(item).join(""),
                headerName: item[Object.keys(item).join("")],
                flex: 1,
                minWidth: 120,
                renderCell: ({ row }) => {
                    const dataValue = row[Object.keys(item).join("")];
                    const columnField = formFields.filter((field) => field?.field_slug === Object.keys(item).join(""))[0];
                    const value = typeof dataValue === "object" ? dataValue?.value : dataValue;
                    let isDate = false;
                    const isNumber = NumberFieldConstants.includes(columnField.data_type);
                    if (dateRegex.test(value)) {
                        isDate = true;
                    }

                    return isDate ? <p>{dayjs(value).format("DD/MM/YYYY")}</p> : <p>{isNumber ? parseFloat(value) : value}</p>;
                },
            }
            columnsData.push(column)
        })
        columnsData.push({
            field: "clientActions",
            headerName: t("netfree.clientActions"),
            flex: 1,
            minWidth: 160,
            renderCell: ({ row }) => {
                return (
                    <div className="h-auto w-full flex items-center justify-around">
                        <MdEdit className="text-blueSecondary w-5 h-5 hover:cursor-pointer" onClick={() => editClientHandler(row)} />
                        <MdDelete className="text-blueSecondary w-5 h-5 hover:cursor-pointer" onClick={() => deleteClientHandler(row.id)} />
                    </div>
                );
            },
        })
        setColumns(columnsData);
        setFullFormData(formFields);
        setAllClients(clientsData?.data?.data);
        if (clientsData?.data?.data.length > 0) {
            setEditClient(clientsData?.data?.data[0]);
        }
        setIsLoading(false);
    }

    const fetchNetfreeProfiles = async () => {
        const profilesListData = await categoryService.getProfilesList("");
        setNetfreeProfiles(profilesListData.data.data);
    }

    const editClientHandler = (data) => {
        setEditClient(data);
        setNewClient(false);
        setClientModal(true);
    }

    const deleteClientHandler = async (id) => {
        const res = await clientsService.deleteClient(id);
        fetchClientsData();
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

    const handleRowClick = (rowData) => {
        navigate(`/clients/${rowData.row.id}`);
    }

    useEffect(() => {
        fetchClientsData();
        fetchNetfreeProfiles();
        fetchFullformDataHandler(setIsLoading, setFullFormData, setDisplayFormValues, setDisplayFields)
    }, [paginationModel.page, lang]);

    return (
        <div className='w-full bg-white rounded-3xl'>
            {allClients && netfreeprofiles && editClient && clientModal &&
                <ClientModal
                    showModal={clientModal}
                    setShowModal={setClientModal}
                    newClient={newClient}
                    client={editClient}
                    clientLists={allClients}
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
                <div className='flex max-w-[300px]'>
                    <AddButtonIcon extra={''} onClick={() => {
                        setNewClient(true);
                        setClientModal(true);
                    }} />
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
            {
                isLoading &&
                <div className='h-[90vh] w-full flex justify-center items-center'>
                    <Loader />
                </div>
            }
            <div className='h-[calc(100vh-170px)] overflow-y-auto overflow-x-auto mx-5 px-2'>
                {
                    fullFormData && columns && <DataGrid
                        style={{
                            height: "95%"
                        }}
                        rows={allClients}
                        columns={columns}
                        loading={isLoading}
                        rowCount={totalRows}
                        onRowClick={handleRowClick}
                        initialState={{
                            pagination: {
                                paginationModel: paginationModel,
                            },
                            filter: {
                                filterModel: {
                                    items: [],
                                },
                            },
                        }}
                        sx={{
                            borderRadius: "10px",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "rgba(59,130, 246 , 0.1)",
                            },
                        }}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10]}
                        paginationMode="server"
                        disableSelectionOnClick
                        disableRowSelectionOnClick
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        slots={{ toolbar: DataGridSeachBar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                    />
                }
            </div>
            {
                showDisplayModal &&
                <DisplayFieldsModal
                    formValues={displayFormValues}
                    displayFields={displayFields}
                    onClick={() => {
                        fetchFullformDataHandler(setIsLoading, setFullFormData, setDisplayFormValues, setDisplayFields);
                        fetchClientsData();
                    }}
                    showModal={showDisplayModal}
                    setShowModal={setShowDisplayModal}
                />
            }
        </div>
    )
}

export default Clients
