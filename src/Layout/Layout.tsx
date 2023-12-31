import OutgoingModel from "../components/components/OutgoingModel/OutgoingModel";
import IncommingModel from "../components/components/IncommingModel/IncommingModel";
import HeaderComponent from "../components/components/HeaderComponent/HeaderComponent";

import { Outlet } from "react-router-dom";
import { UseMoel } from "../provider/ModelProvider/ModelProvider";
import { useSipPhone } from "../provider/SipPhoneProvider/SipPhoneProvider";
import { CallTypeEnum } from "../provider/SipPhoneProvider/SipPhoneProvider";
const Layout = () => {
  const { outgoingCall, inCommingCall } = UseMoel();
  const { callType } = useSipPhone();
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

              <div
                className={`video relative ${
                  callType === CallTypeEnum.VIDEO ? "visible" : "hidden"
                } `}
              >
                <video
                  id="remoteVideo"
                  width="100%"
                  muted={false}
                  className="bg-slate-900"
                >
                  <p>Your browser doesn't support HTML5 video.</p>
                </video>
                <div className="video-local absolute w-1/3 h-1/3 bottom-0 right-0 bg-black">
                  <video id="localVideo" width="100%" muted={false}>
                    <p>Your browser doesn't support HTML5 video.</p>
                  </video>
                </div>
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
