import React, { useEffect, useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import Sidebar from '../component/common/Sidebar';
import Dashboard from '../views/Dashboard';

const DefaultLayout = () => {

  const [open, setOpen] = useState(true);
  // const [currentRoute, setCurrentRoute] = useState("Main Dashboard");

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  return (
    // <div>

    // <Routes>
    //        <Route path='/dashboard' element={<Dashboard />} />

    //        {/* <Route path='/hellow2' element={<Hellow2 />}/> */}

    // </Routes>

    // </div>

    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pe-2 xl:mr-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            {/* <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            /> */}
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                <Route path='/dashboard' element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DefaultLayout
