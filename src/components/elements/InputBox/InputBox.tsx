import { IconType } from "react-icons";

const InputBox = ({
  name,
  label,
  errors,
  message,
  register,
  iconClass,
  className,
  inputType,
  InputIcon,
}: {
  name: string;
  label: string;
  errors: any;
  message: string;
  register: any;
  iconClass: string;
  className: string;
  inputType: string;
  InputIcon?: IconType;
  //errors: ReturnType<typeof useForm>["formState"]["errors"];
  //register: ReturnType<typeof useForm>["register"];
}) => {
  return (
    <label htmlFor="" className="flex flex-col gap-y-1">
      <span className="text-base font-normal py-1">{label}</span>
      <div className="flex">
        {InputIcon && (
          <div className="flex justify-center items-center border p-1">
            <InputIcon className={`${iconClass}`} />
          </div>
        )}
        <input
          type={inputType}
          className={`${className} outline-none`}
          {...register(name, {
            required: {
              value: true,
              message,
            },
          })}
        />
      </div>
      {
        <span className="text-sm text-red-500 mt-1">
          {errors[name]?.message}
        </span>
      }
    </label>
  );
};

export default InputBox;
