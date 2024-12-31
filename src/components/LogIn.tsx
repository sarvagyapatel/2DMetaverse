import { useForm } from "react-hook-form";
import { User } from "../types/user.types";
import { userLogin } from "../services/auth.services";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RingLoader } from "react-spinners";

function LogIn() {
    const { register, handleSubmit } = useForm<User>();
    const navigate = useNavigate();
    const [isloding, setIsloading] = useState<boolean>(false);

    const onSubmit = async (data: User) => {
        try {
            setIsloading(true);
            const response = await userLogin(data);
            setIsloading(false);
            if(response.user.roomId){
                navigate('/room')
            }else{
                navigate('/createroom')
            }
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 md:p-16 rounded-3xl shadow-xl bg-white text-gray-800 mt-12">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">
                Sign in to your account
            </h2>
            <p className="text-center text-gray-500 mt-2">
                Welcome back! Please enter your credentials.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="flex flex-col space-y-4">
                    <input
                        placeholder="Enter your email address"
                        type="email"
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPattern: (value) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be valid",
                            },
                        })}
                    />
                    <input
                        placeholder="Enter password"
                        type="password"
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...register("password", { required: true })}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    {isloding?(
                        <RingLoader
                        color="white"
                        size={19}
                      />
                    ):("Sign In")}
                </button>
            </form>

            <p className="text-sm text-gray-400 text-center mt-6">
                Don't have an account?{" "}
                <a
                    href="/signup"
                    className="text-blue-600 font-semibold hover:underline"
                >
                    Sign up
                </a>
            </p>
        </div>

    )
}
export default LogIn