import { useTranslation } from "react-i18next";
import SearchField from "../component/fields/SearchField";
import ToggleSwitch from "../component/common/ToggleSwitch";
import AddButtonIcon from "../component/common/AddButton";
import categoryService from "../services/category";
import { useEffect, useState } from "react";
import {
    MdExpandMore
} from "react-icons/md";
import Loader from "../component/common/Loader";
import { debounce } from "lodash";
import ActionModal from "../component/category/ActionModal";

const NetFree = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [categoriesDataCopy, setCategoriesDataCopy] = useState([]);
    const [actionsList, setActionsList] = useState([]);
    const [defaultActionList, setDefaultActionList] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [isDefaultActionSelectOpen, setIsDefaultActionSelectOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const [showActionModal, setShowActionModal] = useState(false);
    const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = useState(0);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('')
    const [siteSearch, setSiteSearch] = useState('')
    const setResponseDataToState = (res) => {
        const response = res.data.data.map(el => {
            el.isActionUpdateEnabled = false;
            el.actions = el.actions.map(item => {
                return { isClicked: false, isActionEditOn: false, ...item };
            })
            return el;
        })
        setCategoriesData(response);
        setCategoriesDataCopy(response);
        if (siteSearch) {
            searchCategories(siteSearch, response)
        } else {
            searchCategories(currentSearchTerm, response)
        }

    }

    const getCategoryData = async () => {
        setIsLoading(true);
        const response = await categoryService.getCategories();
        setResponseDataToState(response);
        setIsLoading(false);
    }

    const getDefaultActions = async () => {
        const response = await categoryService.getDefaultAction();
        setDefaultActionList(response.data.data);
    }

    const deleteDefaultAction = async (actionId) => {
        setIsLoading(true);
        const actionsPayload = defaultActionList.map(el => {
            if (el.id != actionId) {
                return el.id
            }
        })
        await categoryService.setDefaultAction({ actions: actionsPayload });
        await getActionsList();
        getCategoryData();
        setIsLoading(false);
    }

    const getActionsList = async () => {
        getDefaultActions().then(async () => {
            const response = await categoryService.getActions();
            setActionsList(response.data.data);
        })
    }

    const handleUpdateCategory = () => {
        categoryService.updateCategories();
    }

    const enableActionUpdate = (element) => {
        if (element) {
            setCurrentSelectedCategoryId(element.categories_id);
        }
        setShowActionModal(true);
    }

    const updateAction = async (data) => {
        setIsLoading(true);
        await categoryService.updateActionInCategory(data);
        if (siteSearch) {
            searchSetting(siteSearch)
        } else {
            getCategoryData();
        }

        setIsLoading(false);
    }

    const deleteAction = (categoryId, actionToRemove) => {
        setIsLoading(true);
        updateAction({ id: categoryId, to_remove: actionToRemove });
        setIsLoading(false);
    }

    // update/edit action value
    const editAction = (categoryId, currentActions, actionToRemove, newValue) => {
        setIsLoading(true);
        updateAction({ id: categoryId, to_add: newValue })
        setIsLoading(false);
    }

    //make current action editable
    const editSelectedAction = (categoyId, action) => {
        setCurrentSelectedCategoryId(categoyId);
        setEditActionId(action.id);
        setShowActionModal(true);
    }

    const searchCategories = (searchTerm, response) => {
        setCurrentSearchTerm(searchTerm);
        if (siteSearch) {
            setCategoriesData(response);
        }
        else if (currentSearchTerm) {
            const filteredData = response?.filter((el) =>
                el.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setCategoriesData(filteredData);
        } else {
            setCategoriesData(response);
        }


    }

    const searchSetting = async (query) => {

        setIsLoading(true);
        setSiteSearch(query)
        const response = await categoryService.searchSiteSetting(query);
        if (query.length) {
            setSearchResult(response.data.data);
        } else {
            setSearchResult([]);
        }
        setResponseDataToState(response);
        setIsLoading(false);
    }

    const handleSiteSearch = debounce((e) => searchSetting(e.target.value), 500);

    const openActionOptions = (categoyIndex, action) => {
        let updatedCategoryData = JSON.parse(JSON.stringify(categoriesData));
        updatedCategoryData.forEach((el, ind) => {
            if (ind === categoyIndex) {
                el.actions = el.actions.map(item => {
                    item.label === action.label ? item.isClicked = !item.isClicked : item.isClicked = false;
                    return item;
                })
            }
        })
        setCategoriesData(updatedCategoryData);
    }

    const setDefaultAction = async (actionId, data) => {
        setIsLoading(true);
        const actionsPayload = defaultActionList.map(el => el.id);
        await categoryService.setDefaultAction({ actions: [...actionsPayload, actionId], ...data });
        await getActionsList();
        getCategoryData();
        setIsDefaultActionSelectOpen(false);
        setIsLoading(false);
    }

    useEffect(() => {
        getCategoryData();
        getActionsList();
    }, []);

    const ActionSelectBox = ({ options, categoryName, categoryId, currentActions, operationType, previousValue }) => {
        return (
            <div className="w-auto mx-3 mt-1">
                <select onChange={(e) => operationType === 'edit' ? editAction(categoryId, currentActions, previousValue, e.target.value) : updateAction({ id: categoryId, to_add: Number(e.target.value) })} placeholder="Select Action" value={'selectAction'} className="bg-white border-[1px] py-1 px-2 outline-none rounded-md" onBlur={() => editSelectedAction(categoryId, { label: 'close edit options' })}>
                    <option value={'selectAction'} disabled>Select Action</option>
                    {
                        options?.map(el => {
                            return (
                                el ? <option key={categoryName + el.id} value={el.id}>{el.label}</option> : null
                            );
                        })
                    }
                </select>
            </div>
        );
    }
    return (
        <div className="md:h-full w-full flex-col-reverse md:flex-row flex gap-4">
            <ActionModal
                showModal={showActionModal}
                setShowModal={setShowActionModal}
                updateAction={updateAction}
                categoryId={currentSelectedCategoryId}
                setDefaultAction={setDefaultAction}
                isDefault={isDefaultActionSelectOpen}
            />
            <div className="bg-white rounded-3xl w-full md:w-[calc(100%-260px)]">
                <h3 className='py-4 px-7 font-bold text-[#2B3674]'>{t('netfree.categories')}</h3>
                {
                    isLoading &&
                    <div className='h-[calc(100%-36px)] w-full flex justify-center items-center'>
                        <Loader />
                    </div>
                }
                <div className='h-[calc(100%-72px)] max-w-[100%] overflow-x-auto overflow-y-auto mx-5 px-2'>
                    <table className='!table text-[12px] overflow-y-auto w-full'>
                        <thead className="sticky top-0 z-10">
                            <tr className=' pr-3 bg-lightPrimary rounded-lg'>
                                <th className='pb-2 px-1 w-[15rem]'>
                                    <h5 className='text-start text-[10px] md:text-[14px] font-bold text-[#2B3674] w-[15rem]'>{t('netfree.name')}</h5>
                                    <SearchField
                                        variant="auth"
                                        type="text"
                                        placeholder={t('searchbox.placeHolder')}
                                        onChange={(e) => searchCategories(e.target.value, categoriesDataCopy)}
                                        name="name"
                                    />
                                </th>
                                <th className='flex px-5'>
                                    <h5 className='text-start text-[10px] md:text-[14px] font-bold text-[#2B3674]'>{t('netfree.actions')}</h5>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="pt-5">
                            {
                                categoriesData.map((el, currentIndex) => {
                                    return (
                                        <tr className='h-[20px] border-t bottom-b border-sky-500 w-[100%]' key={el.categories_id}>
                                            <td className="">
                                                <h5 className="font-bold text-[#2B3674] break-words w-[15rem]">{el.name}</h5>
                                            </td>
                                            <td className='pl-5 pr-5 flex gap-2 py-[6px]'>
                                                {
                                                    el.actions.map((action, index) => {
                                                        return (
                                                            action.label.length ?
                                                                action.isActionEditOn ?
                                                                    <ActionSelectBox
                                                                        options={actionsList.map(item => !el.actions.some(el => el.label === item.label) ? item : null)}
                                                                        categoryName={el.name}
                                                                        categoryId={el.categories_id}
                                                                        currentActions={actionsList.map((item, index) => el.actions.some(el => el.label === item.label) ? item.id : null)}
                                                                        operationType="edit"
                                                                        previousValue={action.label}
                                                                    />
                                                                    :
                                                                    <div key={action + index} className="px-3 relative py-1 bg-[#F4F7FE] rounded-full flex gap-2 whitespace-nowrap">{action.label}
                                                                        <span onClick={() => openActionOptions(currentIndex, action)}>
                                                                            <MdExpandMore className="h-5 w-5 text-blueSecondary cursor-pointer" />
                                                                        </span>
                                                                        {
                                                                            action.isClicked &&
                                                                            <div
                                                                                className={`absolute top-[20px] z-10 drop-shadow-md bg-white cursor-pointer ${i18n.dir() === 'rtl' ? 'left-[-15px]' : 'right-[-15px]'}`}

                                                                            >
                                                                                {/* <div className="py-1 px-3 border-b-[1px] hover:bg-[#f2f3f5]" onClick={() => editSelectedAction(el.categories_id, action)}>{t('netfree.edit')}</div> */}
                                                                                <div className="py-1 px-3 hover:bg-[#f2f3f5]" onClick={() => deleteAction(el.categories_id, action.id)}>{t('netfree.remove')}</div>

                                                                            </div>
                                                                        }
                                                                    </div>
                                                                :
                                                                null
                                                        );
                                                    })
                                                }
                                                {
                                                    <AddButtonIcon extra={''} onClick={() => enableActionUpdate(el)} />
                                                }
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col gap-4 h-full w-full md:!min-w-[250px] md:!w-[250px]">
                <div className="bg-white h-[30%] rounded-3xl text-center text-[#2B3674]">
                    <h3 className="p-3 text-[22px] font-bold">{t('netfree.searchSiteSetting')}</h3>
                    <SearchField
                        variant="auth"
                        extra="mb-[10px] -mt-[14px] px-3"
                        id="dateCreated"
                        type="text"
                        placeholder={t('searchbox.placeHolder')}
                        onChange={handleSiteSearch}
                        name="dateCreated"
                        noUnderline="true"
                        borderRadius='30'
                    />
                    <div className="max-h-[calc(100%-100px)] overflow-y-auto">
                        {
                            searchResult.map(result => {
                                return (
                                    <p key={result.categories_id} className="text-[13px] text-left px-3">{result.name}</p>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="flex justify-center items-center bg-white h-[10%] rounded-3xl text-center text-[#2B3674]">
                    <button
                        onClick={handleUpdateCategory}
                        className={`linear m-1 p-2 w-[90%] rounded-full py-[9px] text-[14px] font-small transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
                    >
                        {t('netfree.updateCategoryButton')}
                    </button>
                </div>
                <div className="flex flex-col px-3 py-3 overflow-x-hidden items-start bg-white h-[37%] rounded-3xl text-center text-[#2B3674]">
                    <h5 className="font-bold text-[20px]">{t('netfree.defaultAction')}</h5>
                    <div className="max-h-[calc(100%-30px)] overflow-y-auto mb-2">
                        {
                            defaultActionList.map(el => {
                                return (
                                    <div key={el.id} className="px-3 w-full w-fit whitespace-break-spaces text-left text-[13px] mb-2 relative py-1 bg-[#F4F7FE] rounded-full flex gap-2 whitespace-nowrap">{el.label} <div className="text-[13px] text-[#fc3232] cursor-pointer" onClick={() => deleteDefaultAction(el.id)}>x</div></div>
                                );
                            })
                        }
                    </div>
                    <AddButtonIcon extra={''} onClick={() => {
                        setIsDefaultActionSelectOpen(true);
                        enableActionUpdate();
                    }} />
                </div>
                <div className="py-3 bg-white h-[23%] rounded-3xl text-center text-[#2B3674]">
                    <div className="flex items-center justify-center">
                        <p className="p-2 text-xs">Buyer Review Notifications</p>
                        <ToggleSwitch selected={true} />
                    </div>
                    <div className="flex items-center justify-center">
                        <p className="p-2 text-xs">Buyer Review Notifications</p>
                        <ToggleSwitch selected={true} />
                    </div>
                    <div className="flex items-center justify-center">
                        <p className="p-2 text-xs">Buyer Review Notifications</p>
                        <ToggleSwitch selected={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NetFree;
