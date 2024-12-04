import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User } from "../types/user.types";
import { userRegister } from "../services/auth.services";

function SignUp() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<User>();

    const onSubmit = async (data: User) => {
        try {
            await userRegister(data);
            navigate("/login");
        } catch (err: unknown) {
            console.log(err)
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 md:p-16 rounded-3xl shadow-xl bg-white text-gray-800 mt-12">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">
                Create Your Account
            </h2>
            <p className="text-center text-gray-500 mt-2">
                Join us and start your journey!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="flex flex-col space-y-4">
                    <input
                        placeholder="Enter your username"
                        type="text"
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...register("username", { required: true })}
                    />
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
                    Sign Up
                </button>
            </form>

            <p className="text-sm text-gray-400 text-center mt-6">
                Already have an account?{" "}
                <a
                    href="#"
                    className="text-blue-600 font-semibold hover:underline"
                >
                    Log in
                </a>
            </p>
        </div>

    )
}
export default SignUp