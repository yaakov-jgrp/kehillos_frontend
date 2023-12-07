import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import SearchField from "../component/fields/SearchField";
import requestService from '../services/request';
import Loader from '../component/common/Loader';
import { TablePagination } from '@mui/material';
import NoDataFound from '../component/common/NoDataFound';
import { paginationRowOptions, searchFields } from '../lib/FieldConstants';
import { formateDateTime, handleSort } from '../lib/CommonFunctions';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Request = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(true);
  const [allRequest, setAllRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(100);
  const [searchParams, setSearchParams] = useState(searchFields);


  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSortHandler = (field) => {
    handleSort(field, allRequest, sortField, sortOrder, setSortOrder, setSortField, setAllRequests);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchRequestData = async () => {
    setIsLoading(true);
    try {
      let searchValues = "";
      for (const searchfield in searchParams) {
        if (searchParams[searchfield] !== "") {
          searchValues += `&search_${[searchfield]}=${searchParams[searchfield]}`
        };
      }
      const params = `?page=${page + 1}&lang=${lang}&page_size=${rowsPerPage}${searchValues}`;
      const requestData = await requestService.getRequests(params);
      setTotalCount(requestData?.data?.count)
      setAllRequests(requestData?.data?.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 500)
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const searchResult = (searchBy, value) => {
    let values = [];
    if (searchBy === "from") {
      values = { sender_email: value, customer_id: value, username: value };
    } else if (searchBy === "requestdetail") {
      values = { text: value, requested_website: value };
    } else {
      values = { [searchBy]: value };
    }
    setSearchParams((prev) => ({ ...prev, ...values }));
  }

  useEffect(() => {
    const searchTimer = setTimeout(() => fetchRequestData(), 500)
    return () => clearTimeout(searchTimer);
  }, [lang, page, rowsPerPage, JSON.stringify(searchParams)])

  return (
    <div className='w-full bg-white rounded-3xl'>
      <div className='flex py-4 px-7 font-bold text-[#2B3674]'>{t('requests.title')}</div>
      <div className='h-[calc(100vh-210px)] overflow-y-auto overflow-x-auto mx-5 px-2'>
        <table className='!table text-[12px] md:text-[14px] mb-3'>
          <thead className='sticky top-0 z-10 [&_th]:min-w-[8.5rem]'>
            <tr className='tracking-[-2%] mb-5 bg-lightPrimary'>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={<p onClick={() => handleSortHandler('id')} className='flex cursor-pointer items-center justify-between w-full'>{t('searchbox.requestId')}{sortField === "id" ? sortOrder === "asc" ? <FaArrowUp className='ml-1' /> : <FaArrowDown className='ml-1' /> : <FaArrowUp className='ml-1' />}</p>}
                  id="requestId"
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
                  label={<p onClick={() => handleSortHandler('created_at')} className='flex cursor-pointer items-center justify-between w-full'>{t('searchbox.dateCreated')}{sortField === "created_at" ? sortOrder === "asc" ? <FaArrowUp className='ml-1' /> : <FaArrowDown className='ml-1' /> : <FaArrowUp className='ml-1' />}</p>}
                  id="dateCreated"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('created_at', e.target.value)}
                  name="created_at"
                />
              </th>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={<p onClick={() => handleSortHandler('sender_email')} className='flex cursor-pointer items-center justify-between w-full'>{t('searchbox.from')}{sortField === "from" ? sortOrder === "asc" ? <FaArrowUp className='ml-1' /> : <FaArrowDown className='ml-1' /> : <FaArrowUp className='ml-1' />}</p>}
                  id="from"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('from', e.target.value)}
                  name="from"
                />
              </th>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={<p onClick={() => handleSortHandler('request_type')} className='flex cursor-pointer items-center justify-between w-full'>{t('searchbox.requestType')}{sortField === "request_type" ? sortOrder === "asc" ? <FaArrowUp className='ml-1' /> : <FaArrowDown className='ml-1' /> : <FaArrowUp className='ml-1' />}</p>}
                  id="requestType"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('request_type', e.target.value)}
                  name="request_type"
                />
              </th>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={<p onClick={() => handleSortHandler('requested_website')} className='flex cursor-pointer items-center justify-between w-full'>{t('searchbox.requestdetail')}{sortField === "requestdetail" ? sortOrder === "asc" ? <FaArrowUp className='ml-1' /> : <FaArrowDown className='ml-1' /> : <FaArrowUp className='ml-1' />}</p>}
                  id="requestdetail"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('requestdetail', e.target.value)}
                  name="requestdetail"
                />
              </th>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={<p onClick={() => handleSortHandler('action_done')} className='flex cursor-pointer items-center justify-between w-full'>{t('searchbox.actionsDone')}{sortField === "action_done" ? sortOrder === "asc" ? <FaArrowUp className='ml-1' /> : <FaArrowDown className='ml-1' /> : <FaArrowUp className='ml-1' />}</p>}
                  id="actionsDone"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('action_done', e.target.value)}
                  name="action_done"
                />
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
                    allRequest.length > 0 ? <>                  {
                      allRequest.map((el) => {
                        return (
                          <tr className='h-[75px]' key={el.id}>
                            <td>#{el.id}</td>
                            <td>{formateDateTime(el.created_at).date}<br />{formateDateTime(el.created_at).time}</td>
                            <td>
                              <a href={`https://netfree.link/app/#/sectors/user-filter-settings/${el.customer_id}`} target='_blank' rel="noreferrer"
                                className='text-[#2B3674] hover:text-[#2B3674] font-bold'
                              >#{el.customer_id}<br /></a>
                              {el.username}<br />
                              <a href={`mailto:${el.sender_email}`} className='text-[#2B3674] hover:text-[#2B3674] font-bold' >{el.sender_email}</a>
                            </td>
                            <td>{el.request_type}</td>
                            <td>
                              <a href={el.requested_website} target='_blank' rel="noreferrer" className='text-[#2B3674] hover:text-[#2B3674] font-bold line-clamp-2 break-words'>{el.requested_website}</a>
                              <br />
                              <p className='line-clamp-4 break-words'>{el.text}</p>
                              {/* <div dangerouslySetInnerHTML={{ __html: el.text }} />                  */}
                            </td>
                            <td className='flex justify-center gap-4 px-2'>
                              <div className='bg-[#F4F7FE] px-2 py-1'>{el.action_done}</div>
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

export default Request
