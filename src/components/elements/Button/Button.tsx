import { IconType } from "react-icons";

const Button = ({
  btnType,
  btnName,
  className,
  iconClass,
  BtnIcon,
}: {
  btnType: "button" | "submit" | "reset";
  btnName: string;
  className: string;
  iconClass: string;
  BtnIcon?: IconType;
}) => {
  return (
    <div className="flex justify-center items-center">
      <button
        type={btnType}
        className={`${className} flex justify-center items-center`}
      >
        {BtnIcon && <BtnIcon className={`${iconClass}`} />}
        {btnName}
      </button>
    </div>
  );
};

export default Button;
