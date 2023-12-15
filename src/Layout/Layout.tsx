import OutgoingModel from "../components/components/OutgoingModel/OutgoingModel";
import IncommingModel from "../components/components/IncommingModel/IncommingModel";
import HeaderComponent from "../components/components/HeaderComponent/HeaderComponent";

import { Outlet } from "react-router-dom";
import { UseMoel } from "../provider/ModelProvider/ModelProvider";

const Layout = () => {
  const { outgoingCall, inCommingCall } = UseMoel();
  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full">
        {/* Sidebar */}
        {/* <SidebarComponent /> */}
        <div className="flex flex-col w-full">
          <HeaderComponent />
          <div className="w-full h-full flex justify-center items-center">
            <div className="max-w-md w-full relative">
              {outgoingCall && <OutgoingModel />}
              {inCommingCall && <IncommingModel />}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
