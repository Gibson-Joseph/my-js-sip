import { FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";

const HeaderComponent = () => {
  return (
    <header className="flex  h-fit justify-center items-center px-5 py-2 bg-gray-50">
      <div className="w-full flex justify-center">
        <input
          type="text"
          title="search"
          placeholder="Search ..."
          className="border outline-none focus:border-indigo-600 py-1 px-2 rounded placeholder:text-sm"
        />
      </div>
      <div className="w-full flex items-center gap-x-3 justify-end">
        <div className="bg-gray-100 p-1 rounded-full cursor-pointer">
          <IoMdNotifications className="w-6 h-6" />
        </div>
        <div className="flex justify-center items-center gap-x-2 bg-gray-100 py-1 px-2 rounded-md cursor-pointer">
          <FaUser className="w-5 h-5" />
          {"User Name"}
          <IoIosArrowDown className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
