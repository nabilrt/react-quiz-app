import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../lib/context/auth-context";
import { useState } from "react";
import Header from "../components/Header";

const Login = () => {
    let navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { userLogin, loginLoader, authenticated } = useAuth();

    const onSubmit = async (data: any) => {
        setLoginError(null); // Clear previous error
        const errorMessage = await userLogin(data);
        if (errorMessage) {
            setLoginError(errorMessage); // Set error message if login fails
        }
    };

    if (authenticated) {
        navigate("/user/quiz");
    }

    return (
        <div>
            <div className="font-manrope w-full mb-4 ">
                <Header />
            </div>
            <div className="font-inter flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <p className="text-center text-xl font-semibold">QUIZZY</p>
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                    })}
                                    className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {String(errors.email.message)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {String(errors.password.message)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                textAlign: "center",
                                fontSize: "14px",
                                lineHeight: "21px",
                                fontWeight: "400",
                                color: "#E03838",
                                marginTop: "8px",
                                marginBottom: "8px",
                                height: "25px",
                            }}
                        >
                            {loginError && <span>{loginError}</span>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-primary transition duration-300 ease-out border-2 border-primary rounded-full shadow-md group w-full mt-2"
                            >
                                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        ></path>
                                    </svg>
                                </span>
                                <span className="absolute flex items-center justify-center w-full h-full text-primary transition-all duration-300 transform group-hover:translate-x-full ease">
                                    {loginLoader ? "Loading..." : "Sign in"}
                                </span>
                                <span className="relative invisible">
                                    {loginLoader ? "Loading..." : "Sign in"}
                                </span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-primary hover:text-indigo-500"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
