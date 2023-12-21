import { useSipPhone } from "../../../provider/SipPhoneProvider/SipPhoneProvider";
import { useSound } from "use-sound";

// Icon
import { FaVideo } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { IoIosCall } from "react-icons/io";

// Sounds
import DTMF0 from "../../../assets/sounds/DTMF0.mp3";
import DTMF1 from "../../../assets/sounds/DTMF1.mp3";
import DTMF2 from "../../../assets/sounds/DTMF2.mp3";
import DTMF3 from "../../../assets/sounds/DTMF3.mp3";
import DTMF4 from "../../../assets/sounds/DTMF4.mp3";
import DTMF5 from "../../../assets/sounds/DTMF5.mp3";
import DTMF6 from "../../../assets/sounds/DTMF6.mp3";
import DTMF7 from "../../../assets/sounds/DTMF7.mp3";
import DTMF8 from "../../../assets/sounds/DTMF8.mp3";
import DTMF9 from "../../../assets/sounds/DTMF9.mp3";
import { useState } from "react";

const DialpadComponent = () => {
  const { sipNum, setSipNum, makeCallRequest } = useSipPhone();
  const [sounds] = useState<any>({
    DTMF0,
    DTMF1,
    DTMF2,
    DTMF3,
    DTMF4,
    DTMF5,
    DTMF6,
    DTMF7,
    DTMF8,
    DTMF9,
  });

  const [zero, zeroActio] = useSound(DTMF0, {
    loop: false,
    forceSoundEnabled: true,
    soundEnabled: true,
  });

  const [one, oneActio] = useSound(DTMF1, {
    loop: false,
    forceSoundEnabled: true,
    soundEnabled: true,
  });

  const [two, twoActio] = useSound(DTMF2, {
    loop: false,
    forceSoundEnabled: true,
    soundEnabled: true,
  });

  return (
    <div className="p-5 bg-gray-50 w-full">
      <div className="border-t-4 border-t-red-500 shadow-lg bg-white rounded py-3">
        <div className=" py-3 px-2 w-full flex">
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
              makeCallRequest(true, false);
            }}
          >
            <IoIosCall className="w-7 h-7" /> <span>Call</span>
          </button>
          <button
            type="button"
            className="bg-red-400 hover:bg-red-500 text-white transition-all duration-300 py-3 px-3 w-full flex justify-center items-center gap-2 text-xl font-[PublicSans]"
            onClick={() => {
              makeCallRequest(true, true);
            }}
          >
            <FaVideo className="w-7 h-7" /> <span>Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialpadComponent;
