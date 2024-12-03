
import { useForm } from "react-hook-form";
import { User } from "../types/user.types";
import { userLogin } from "../services/auth.services";

function LogIn() {
    const { register, handleSubmit } = useForm<User>();

    const onSubmit = async (data: User) => {
        try {
            const response = await userLogin(data);
            console.log(response)
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className="h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
            <div className="w-full h-full flex justify-center items-center ">
                <div className="w-full max-w-md mx-auto p-16 rounded-3xl shadow-2xl bg-white text-gray-800 mt-8">
                    <h2 className="text-2xl font-bold text-center text-black">
                      Sign in to your account
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                        <input
                            placeholder="Enter your email address" 
                            type="email"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            {...register("password", { required: true })}
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            SignIn
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default LogIn