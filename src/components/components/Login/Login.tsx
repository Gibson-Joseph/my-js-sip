import Button from "../../elements/Button/Button";
import InputBox from "../../elements/InputBox/InputBox";
import { useForm } from "react-hook-form";
import { useSipClient } from "../../../provider/SipClientProvider/SipClientProvider";

// Icon
import { FaUser } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

type TUser = {
  userName: string;
  password: string;
};

const Login = () => {
  const { main } = useSipClient();

  const defaultValues: TUser = {
    userName: "",
    password: "",
  };

  const methods = useForm({
    defaultValues,
  });

  const submitHandler = (data: TUser) => {
    console.log("submit data", data);
    main(data.userName, data.password);
  };

  const { errors } = methods.formState;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="max-w-xl w-full flex flex-col gap-y-2 p-8 border rounded-md shadow-lg">
        <div className="w-full">
          <h1 className="text-center text-2xl font-medium">SIP LOGIN</h1>
        </div>
        <form
          onSubmit={methods.handleSubmit(submitHandler)}
          className="flex flex-col gap-y-2 w-full"
        >
          <div className="flex flex-col gap-y-4">
            <InputBox
              label="User Name :"
              register={methods.register}
              message={"user name is required"}
              name="userName"
              errors={errors}
              className="border py-2 px-3 focus:border-blue-500 w-full"
              iconClass="w-7 h-7 p-1"
              InputIcon={FaUser}
              inputType="text"
            />
            <InputBox
              label="Password :"
              register={methods.register}
              message={"password is required"}
              name="password"
              errors={errors}
              className="border py-2 px-3 focus:border-blue-500 w-full"
              iconClass="w-7 h-7 p-1"
              InputIcon={RiLockPasswordLine}
              inputType="text"
            />
          </div>
          <div className="mt-2">
            <Button
              btnName="Login"
              className="py-2 px-3 border bg-blue-500 w-full text-white font-medium gap-x-2"
              btnType="submit"
              iconClass="w-7 h-7"
              BtnIcon={AiOutlineLogin}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
