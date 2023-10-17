import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import SearchField from "../component/fields/SearchField";
import Loader from '../component/common/Loader';
import clientsService from '../services/clients';
import AddButtonIcon from '../component/common/AddButton';
import categoryService from '../services/category';
import ClientModal from '../component/category/ClientModal';
import {
    MdDelete,
    MdEdit
} from "react-icons/md";


let filterFields = {
    userID: '',
    name: '',
    email: '',
    phone: '',
    sector: '',
    profile: '',
}

const Clients = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [allClients, setAllClients] = useState([]);
    const [allClientsCopy, setAllClientsCopy] = useState([]);
    const [clientModal, setClientModal] = useState(false);
    const [newClient, setNewClient] = useState(true);
    const [editClient, setEditClient] = useState({});
    const [netfreeprofiles, setNetfreeProfiles] = useState(null);

    const fetchClientsData = async () => {
        setIsLoading(true);
        const clientsData = await clientsService.getClients();
        setAllClients(clientsData?.data?.data);
        setAllClientsCopy(clientsData?.data?.data);
        if (clientsData?.data?.data.length > 0) {
            setEditClient(clientsData?.data?.data[0]);
        }
        setIsLoading(false);
    }

    const fetchNetfreeProfiles = async () => {
        const profilesListData = await categoryService.getProfilesList("");
        setNetfreeProfiles(profilesListData.data.data);
    }

    const searchResult = (searchBy, value) => {
        filterFields[searchBy] = value.trim().toLowerCase();
        let results = JSON.parse(JSON.stringify(allClientsCopy));
        results = results.filter((client) => {
            return client.user_id.toString().includes(filterFields.userID.toString())
                && client.full_name.toLowerCase().includes(filterFields.name)
                && client.email.toString().includes(filterFields.email)
                && client.phone.toString().includes(filterFields.phone.toString())
                && client.sector.toString().includes(filterFields.sector.toString())
                && client.netfree_profile.toString().includes(filterFields.profile.toString())
        })
        if (!filterFields.userID && !filterFields.name && !filterFields.email && !filterFields.phone && !filterFields.sector && !filterFields.profile) {
            setAllClients(allClientsCopy);
        } else {
            setAllClients(results);
        }
    }

    const editClientHandler = (data) => {
        setEditClient(data);
        setNewClient(false);
        setClientModal(!clientModal);
    }

    const deleteClientHandler = async (id) => {
        const res = await clientsService.deleteClient(id);
        fetchClientsData();
    }

    useEffect(() => {
        fetchClientsData();
        fetchNetfreeProfiles();
        return () => { };
    }, [])
    return (
        <div className='w-full bg-white rounded-3xl'>
            {allClients && netfreeprofiles && editClient && <ClientModal
                showModal={clientModal}
                setShowModal={setClientModal}
                newClient={newClient}
                client={editClient}
                clientLists={allClients}
                netfreeProfiles={netfreeprofiles}
                onClick={() => { setNewClient(true); fetchClientsData(); }}
            />}
            <div className='flex justify-between py-4 px-7 font-bold text-[#2B3674]'>{t('clients.title')}
                <AddButtonIcon extra={''} onClick={() => {
                    setNewClient(true);
                    setClientModal(!clientModal);
                }} />
            </div>
            {
                isLoading &&
                <div className='h-[90vh] w-full flex justify-center items-center'>
                    <Loader />
                </div>
            }
            <div className='h-[calc(100vh-170px)] overflow-y-auto overflow-x-auto mx-5 px-2'>
                <table className='!table text-[12px] md:text-[14px] mb-3'>
                    <thead className='sticky top-0 z-10 [&_th]:min-w-[5.5rem]'>
                        <tr className='tracking-[-2%] mb-5 bg-lightPrimary'>
                            <th className='pr-2'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('searchbox.clientUserID')}
                                    id="clientUserID"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('userID', e.target.value)}
                                    name="user_id"
                                />
                            </th>
                            <th className='pr-3'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('searchbox.name')}
                                    id="name"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('name', e.target.value)}
                                    name="full_name"
                                />
                            </th>
                            <th className='pr-3'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('searchbox.email')}
                                    id="email"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('email', e.target.value)}
                                    name="email"
                                />
                            </th>
                            <th className='pr-3'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('searchbox.phone')}
                                    id="phone"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('phone', e.target.value)}
                                    name="phone"
                                />
                            </th>
                            <th className='pr-3'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('searchbox.sector')}
                                    id="sector"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('sector', e.target.value)}
                                    name="sector"
                                />
                            </th>
                            <th className='pr-3'>
                                <SearchField
                                    variant="auth"
                                    extra="mb-2"
                                    label={t('searchbox.profile')}
                                    id="profile"
                                    type="text"
                                    placeholder={t('searchbox.placeHolder')}
                                    onChange={(e) => searchResult('profile', e.target.value)}
                                    name="netfree_profile"
                                />
                            </th>
                            <th>
                                <p className='text-[10px] md:text-[14px] text-navy-700 ml-1.5 font-medium'>{t("netfree.clientActions")}</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='[&_td]:min-w-[5rem]'>
                        {
                            allClients.map((el) => {
                                return (
                                    <tr className='h-[75px]' key={el.id}>
                                        <td>#{el.user_id}</td>
                                        <td>{el.full_name}</td>
                                        <td>
                                            <a href={`mailto:${el.email}`} className='text-[#2B3674] hover:text-[#2B3674] font-bold' >{el.email}</a>
                                        </td>
                                        <td className='text-center'>{el.phone}</td>
                                        <td className='text-center'>{el.sector}</td>
                                        <td className='text-center'>{netfreeprofiles.filter((profile) => profile.id == el.netfree_profile)[0].name}</td>
                                        <td>
                                            <div className="h-auto flex flex-col items-center justify-between">
                                                <MdEdit className="text-blueSecondary mb-2 w-5 h-5 hover:cursor-pointer" onClick={() => editClientHandler(el)} />
                                                <MdDelete className="text-blueSecondary w-5 h-5 hover:cursor-pointer" onClick={() => deleteClientHandler(el.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Clients
