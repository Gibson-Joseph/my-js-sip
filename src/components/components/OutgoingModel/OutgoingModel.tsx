import { useSipPhone } from "../../../provider/SipPhoneProvider/SipPhoneProvider";

// Icon
import { HiPhoneMissedCall } from "react-icons/hi";

const OutgoingModel = () => {
  const { callReject } = useSipPhone();
  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="absolute z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-full max-h-full flex justify-center items-center bg-gray-950/50 "
    >
      <div className="w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-md h-full px-3 py-5 space-y-5 border-t-4 border-t-red-600">
          <div className="flex flex-col justify-center items-center w-full gap-y-3">
            <div className="bg-indigo-400 h-20 w-20 rounded-full flex justify-center items-center cursor-pointer">
              <span className="text-3xl font-medium">G</span>
            </div>
            <div className="w-full flex flex-col justify-center items-center font-[PublicSans] mb-5">
              <h1>{"Gibson"}</h1>
              <span className="text-sm">Connecting ...</span>
            </div>
            <div className="flex">
              <button
                type="button"
                title="Decline"
                className="w-full flex justify-center items-center gap-x-2 px-3 py-3 text-white rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 font-[PublicSans]"
                onClick={() => {
                  callReject();
                }}
              >
                <HiPhoneMissedCall className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutgoingModel;
