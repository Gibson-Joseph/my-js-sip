import { useNavigate } from "react-router-dom";
import { useSipPhone } from "../../../provider/SipPhoneProvider/SipPhoneProvider";

// icons
import { IoMdAdd } from "react-icons/io";
import { GoUnmute } from "react-icons/go";
import { MdCallEnd } from "react-icons/md";
import { IoMdKeypad } from "react-icons/io";
import { IoIosPause } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { RiArrowGoForwardFill } from "react-icons/ri";
import { useCallback, useState } from "react";

// Icon
import { FaVideo } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { IoIosCall } from "react-icons/io";

const AnsweredComponent = () => {
  const { callReject, holdCall, muteCall, addToCall, setSipNum, sipNum } =
    useSipPhone();
  const navigate = useNavigate();
  const [isAddToCallTrigger, setIsAddToCalltrigger] = useState(false);

  const AddToCallModel = useCallback(() => {
    return (
      <div className="w-full h-full p-10 bg-slate-700/50 absolute flex justify-center items-center">
        <div className="bg-white shadow-lg w-fit rounded-md">
          <div className="py-3 px-2 w-full flex gap-x-2">
            <button
              title="back"
              type="button"
              className="p-1 w-10 h-10 rounded-full hover:bg-slate-200 transition-all duration-300 flex justify-center items-center"
              onClick={() => setIsAddToCalltrigger(false)}
            >
              <IoIosArrowBack className="w-full h-full" />
            </button>
            <div className="flex">
              <input
                value={sipNum}
                title="num"
                type="text"
                className="py-2 px-2 rounded-tl-md rounded-bl-md outline-none border focus:border-indigo-400 w-full text-xl placeholder:text-base"
                placeholder="Enter you SIP number"
                onChange={(e: any) => {
                  setSipNum(e.target.value);
                }}
              />
              <button
                type="button"
                title="delete"
                className="bg-[#ddd] flex justify-center items-center rounded-tr-md rounded-br-md px-3 py-1 cursor-pointer"
                onClick={() => {
                  const val = sipNum.slice(0, -1);
                  setSipNum(val);
                }}
              >
                <FiDelete className="w-5 h-5" />
              </button>
            </div>
          </div>
          <hr className="py-4" />
          <div className="grid grid-cols-3 gap-2 w-full h-full px-3">
            {["1", "2", "3", "4", "5", "6", " 7", "8", "9", "*", "0", "#"].map(
              (item: any, index: number) => {
                return (
                  <button
                    key={index}
                    type="button"
                    className="py-5 border px-5 hover:bg-gray-400/30 transition-all duration-200 focus:scale-105 text-xl rounded-md focus:bg-gray-400/30 font-[PublicSans]"
                    onClick={() => {
                      const val = sipNum === "0" ? item : sipNum + item;
                      setSipNum(val);
                    }}
                  >
                    {item}
                  </button>
                );
              }
            )}
          </div>
          <div className="w-full p-2 mt-3 flex gap-x-1">
            <button
              type="button"
              className="bg-blue-400 hover:bg-blue-500 text-white transition-all duration-300 py-3 px-3 w-full flex justify-center items-center gap-2 text-xl font-[PublicSans]"
              onClick={() => {
                addToCall();
              }}
            >
              <IoIosCall className="w-7 h-7" /> <span>Call</span>
            </button>
          </div>
        </div>
      </div>
    );
  }, [sipNum]);

  return (
    <div className="bg-[#dddddd7e] relative">
      {isAddToCallTrigger && <AddToCallModel />}
      <div className="p-5">
        <div className="border-t-4 border-t-red-500 shadow-lg bg-white rounded">
          <button
            title="back"
            type="button"
            className="border rounded-full p-2 h-10 w-10 flex justify-center items-center mt-2 ml-2 cursor-pointer hover:bg-gray-300 transition-all duration-200"
            onClick={() => {
              navigate("/");
            }}
          >
            <IoIosArrowBack className="w-7 h-7" />
          </button>
          <div className=" py-5 px-5 w-full flex flex-col justify-center">
            <div className=" py-5 px-2 w-full flex flex-col justify-center items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-400 flex justify-center items-center border cursor-pointer">
                <span className="text-3xl">G</span>
              </div>
              <h1 className="text-xl text-center pt-4 font-sans">Gibson</h1>
              <h5 className="text-sm font-sans">00:00</h5>
            </div>
            <div className="w-full space-y-8 px-6 sm:px-8 py-4 transition-all duration-200">
              <div className="w-full flex justify-between items-center">
                {/* Mute */}
                <div className="flex flex-col justify-center items-center gap-y-1">
                  <button
                    type="button"
                    title="Mute"
                    className="bg-blue-900/10 hover:bg-slate-900/30 transition-all duration-200 rounded-full p-3 cursor-pointer font-[PublicSans] w-fit"
                    onClick={() => {
                      muteCall();
                    }}
                  >
                    <FaMicrophone className="w-6 h-6" />
                  </button>
                  <span className="text-xs w-fit">Mute</span>
                </div>

                {/* Speaker */}
                <div className="flex flex-col justify-center items-center gap-y-1">
                  <button
                    type="button"
                    title="Speaker"
                    className="bg-blue-900/10 hover:bg-slate-900/30 transition-all duration-200 rounded-full p-3 cursor-pointer font-[PublicSans] w-fit"
                  >
                    <GoUnmute className="w-6 h-6" />
                  </button>
                  <span className="text-xs w-fit">Speaker</span>
                </div>
                {/* KeyPad */}
                <div className="flex flex-col justify-center items-center gap-y-1">
                  <button
                    type="button"
                    title="KeyPad"
                    className="bg-blue-900/10 hover:bg-slate-900/30 transition-all duration-200 rounded-full p-3 cursor-pointer font-[PublicSans] w-fit"
                  >
                    <IoMdKeypad className="w-6 h-6" />
                  </button>
                  <span className="text-xs w-fit">KeyPad</span>
                </div>
              </div>
              <div className="w-full flex justify-between">
                {/* Hold */}
                <div className="flex flex-col justify-center items-center gap-y-1">
                  <button
                    type="button"
                    title="Hold"
                    className="bg-blue-900/10 hover:bg-slate-900/30 transition-all duration-200 rounded-full p-3 cursor-pointer font-[PublicSans] w-fit"
                    onClick={() => {
                      holdCall();
                    }}
                  >
                    <IoIosPause className="w-6 h-6" />
                  </button>
                  <span className="text-xs w-fit">Hold</span>
                </div>
                {/* Add call */}
                <div className="flex flex-col justify-center items-center gap-y-1">
                  <button
                    type="button"
                    title="Add Call"
                    className="bg-blue-900/10 hover:bg-slate-900/30 transition-all duration-200 rounded-full p-3 cursor-pointer font-[PublicSans] w-fit"
                    onClick={() => {
                      setIsAddToCalltrigger(true);
                    }}
                  >
                    <IoMdAdd className="w-6 h-6" />
                  </button>
                  <span className="text-xs w-fit">Add call</span>
                </div>

                {/* Transfer the call */}
                <div className="flex flex-col justify-center items-center gap-y-1">
                  <button
                    type="button"
                    title="Call Transfer"
                    className="bg-blue-900/10 hover:bg-slate-900/30 transition-all duration-200 rounded-full p-3 cursor-pointer font-[PublicSans] w-fit"
                  >
                    <RiArrowGoForwardFill className="w-6 h-6" />
                  </button>
                  <span className="text-xs w-fit">Transfer</span>
                </div>
              </div>
              <div className="w-full flex justify-center mt-5">
                <button
                  type="button"
                  title="hangUp"
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 cursor-pointer transition-all duration-200"
                  onClick={() => {
                    callReject();
                  }}
                >
                  <MdCallEnd className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnsweredComponent;
