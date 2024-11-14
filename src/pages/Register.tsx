import { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
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
            <div className="font-manrope shadow-[0px_12px_6px_0px_rgba(0,_0,_0,_0.1)] w-full mb-4 ">
                <Header />
            </div>

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
                        className="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300 mt-4"
                        type="submit"
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
