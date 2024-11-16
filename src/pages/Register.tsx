import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CgProfile } from "react-icons/cg";
import {  useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { registerUser } from "../lib/api";

type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    profileImage: File | null;
};

const Register = () => {
    let navigate = useNavigate();

    const [imageLink, setImageLink] = useState<string>("");
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    // Initialize useForm hook
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<FormData>();

    // Watch profileImage to update the preview when it changes

    // Upload file handling
    const handleUploadImageClick = () => {
        fileRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImageLink(imageURL);
            setValue("profileImage", file); // Set file in react-hook-form state
        }
    };

    // Form submission handler
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        if (data.profileImage) {
            formData.append("file", data.profileImage);
        }
        try {
            await registerUser(formData);
            setLoading(false);
            navigate("/login");
        } catch (error: any) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div>
            <Header />

            <div className="font-inter container mx-auto py-8 px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                    Registration Form
                </h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto bg-white p-8 rounded-md shadow-md"
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                            Name
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                            type="text"
                            placeholder="John Doe"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                            Email
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                            type="email"
                            placeholder="john@example.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Invalid email format",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                            Password
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                            type="password"
                            placeholder="********"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm md:text-base font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                            type="password"
                            placeholder="********"
                            {...register("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: (value) =>
                                    value === watch("password") ||
                                    "Passwords do not match",
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Profile image upload */}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(e) => {
                            fileRef.current = e;
                            register("profileImage").ref(e); // Register the input for react-hook-form
                        }}
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center items-center">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border border-[#e5eaf2] flex items-center justify-center">
                            {imageLink === "" ? (
                                <CgProfile className="text-6xl sm:text-8xl md:text-9xl text-[#e5eaf2]" />
                            ) : (
                                <img
                                    src={imageLink}
                                    alt="profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            )}
                        </div>

                        <button
                            type="button"
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md mt-4 sm:mt-0 sm:ml-4"
                            onClick={handleUploadImageClick}
                        >
                            Upload profile
                        </button>
                    </div>

                    <button
                        className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-primary transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group w-full mt-4"
                        type="submit"
                    >
                        <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-primary group-hover:h-full"></span>
                        <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                            <svg
                                className="w-5 h-5 text-green-400"
                                fill="none"
                                stroke="#3B9DF8"
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
                        <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                            <svg
                                className="w-5 h-5 text-green-400"
                                fill="none"
                                stroke="#fff"
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
                        <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                            {loading ? "Loading..." : "Register"}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
