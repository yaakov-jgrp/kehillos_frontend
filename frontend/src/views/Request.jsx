import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import SearchField from "../component/fields/SearchField";
import requestService from '../services/request';
import Loader from '../component/common/Loader';


let filterFields = {
  id: '',
  created: '',
  from: '',
  requestType: '',
  requestDetails: '',
  actionsDone: ''
}

const Request = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [allRequest, setAllRequests] = useState([]);
  const [allRequestCopy, setAllRequestsCopy] = useState([]);
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  const fetchRequestData = async () => {
    setIsLoading(true);
    const requestData = await requestService.getRequests();
    setAllRequests(requestData?.data?.data);
    setAllRequestsCopy(requestData?.data?.data);
    setIsLoading(false);
  }

  const formateDateTime = (dateTime) => {
    const date = new Date(dateTime).toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric' });
    let hours = new Date(dateTime).getUTCHours();
    const minutes = new Date(dateTime).getUTCMinutes();
    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    return { date, time }
  }

  const searchResult = (searchBy, value) => {
    filterFields[searchBy] = value.trim().toLowerCase();
    let results = JSON.parse(JSON.stringify(allRequestCopy));
    results = results.filter((request) => {
      return request.id.toString().includes(filterFields.id)
        && request.created_at.toLowerCase().includes(filterFields.created)
        && (request.customer_id.toString().includes(filterFields.from) || request.username.toLowerCase().includes(filterFields.from) || request.sender_email.toLowerCase().includes(filterFields.from))
        && request.request_type.toLowerCase().includes(filterFields.requestType)
        && (request.text.toLowerCase().includes(filterFields.requestDetails) || request.requested_website.toLowerCase().includes(filterFields.requestDetails))
        && request.action_done.toLowerCase().includes(filterFields.actionsDone)
    })
    if (!filterFields.id && !filterFields.created && !filterFields.from && !filterFields.requestType && !filterFields.requestDetails && !filterFields.actionsDone) {
      setAllRequests(allRequestCopy);
    } else {
      setAllRequests(results);
    }
  }

  useEffect(() => {
    fetchRequestData();
  }, [lang])

  return (
    <div className='w-full bg-white rounded-3xl'>
      <div className='flex py-4 px-7 font-bold text-[#2B3674]'>{t('requests.title')}</div>
      {
        isLoading &&
        <div className='h-[90vh] w-full flex justify-center items-center'>
          <Loader />
        </div>
      }
      <div className='h-[calc(100vh-170px)] overflow-y-auto overflow-x-auto mx-5 px-2'>
        <table className='!table text-[12px] md:text-[14px] mb-3'>
          <thead className='sticky top-0 z-10 [&_th]:min-w-[8.5rem]'>
            <tr className='tracking-[-2%] mb-5 bg-lightPrimary'>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t('searchbox.requestId')}
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
                  label={t('searchbox.dateCreated')}
                  id="dateCreated"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('created', e.target.value)}
                  name="created_at"
                />
              </th>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t('searchbox.from')}
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
                  label={t('searchbox.requestType')}
                  id="requestType"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('requestType', e.target.value)}
                  name="request_type"
                />
              </th>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t('searchbox.requestdetail')}
                  id="requestdetail"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('requestDetails', e.target.value)}
                  name="requestdetail"
                />
              </th>
              <th className='pr-3'>
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t('searchbox.actionsDone')}
                  id="actionsDone"
                  type="text"
                  placeholder={t('searchbox.placeHolder')}
                  onChange={(e) => searchResult('actionsDone', e.target.value)}
                  name="action_done"
                />
              </th>
            </tr>
          </thead>
          <tbody className='[&_td]:min-w-[9rem]'>
            {
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
                      <a href={el.requested_website} target='_blank' rel="noreferrer" className='text-[#2B3674] hover:text-[#2B3674] font-bold'>{el.requested_website.length > 70 ? el.requested_website.substring(0, 70) + "..." : el.requested_website}</a>
                      <br />
                      {el.text}
                      {/* <div dangerouslySetInnerHTML={{ __html: el.text }} />                  */}
                    </td>
                    <td className='flex justify-center gap-4 px-2'>
                      <div className='bg-[#F4F7FE] px-2 py-1'>{el.action_done}</div>
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

export default Request
