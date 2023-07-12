
import InputField from "../../component/fields/InputField";
import { Link, useNavigate } from 'react-router-dom'
import i18next from "i18next";
import { useTranslation } from "react-i18next";

export default function SignIn() {

    const { t } = useTranslation();

    const setToken = ()  => {
        localStorage.setItem('user','asgdasdfawersdfagag')
        navigate('/dashboard')
    }
    const navigate = useNavigate()
  return (
    <div className="relative w-screen h-screen">
      <select onChange={(e) => i18next.changeLanguage(e.target.value)} className={`absolute top-[1rem] md:top-[2rem] right-[1rem] md:right-[2rem] p-2 border-[1px] border-[#E0E5F2] rounded-md`}>
        <option value="en" className={ `p-2` }>English</option>
        <option value="he" className={ `p-2` }>Hebrew</option>
      </select>
    <div className="w-[20rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <InputField
          variant="auth"
          extra="mb-3"
          label={ t('auth.email')}
          id="email"
          type="text"
        />
        <InputField
          variant="auth"
          extra="mb-3"
          label={ t('auth.password') }
          id="password"
          type="password"
        />
        <div className="mb-4 flex items-center justify-between px-2">
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            { t('auth.forgotPassword') }
          </a>
        </div>
        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" onClick={setToken}>
          { t('auth.signin') }
        </button>
    </div>
    </div>
  );
}
