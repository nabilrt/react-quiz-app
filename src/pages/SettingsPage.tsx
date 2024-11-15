import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import {
    updateUserPassword,
    updateUserPrivacyStatus,
    userDetails,
} from "../lib/api/index";
import { MdErrorOutline } from "react-icons/md";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

interface FormValues {
    new_password: string;
    confirm_password: string;
}

const SettingsPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiLoading, setAPILoading] = useState<boolean>(false);
    const [apiError, setAPIError] = useState<string | null>(null);
    const [toggleAPISuccess, setToggleAPISuccess] = useState<string | null>(
        null
    );
    const [toggleAPIError, setToggleAPIError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [toggle, setToggle] = useState(false);

    // Fetch user details on component mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            setAPILoading(true);
            try {
                const response = await userDetails();
                // Assuming `privacy` is part of the response data
                setToggle(response.data.user.privacy);
            } catch (err: any) {
                setAPIError("Failed to fetch user details.");
                console.error(err.message);
            } finally {
                setAPILoading(false); // Set loading to false after fetch
            }
        };

        fetchUserDetails();
    }, []);

    // Handle toggle click
    const handlePrivacyToggle = async () => {
        const newPrivacyStatus = !toggle;
        setToggle(newPrivacyStatus); // Optimistically update the UI

        try {
            await updateUserPrivacyStatus();
            setToggleAPISuccess("Privacy status updated successfully");
        } catch (err: any) {
            console.error("Failed to update privacy status:", err.message);
            setToggleAPIError("Failed to update privacy status.");
            setToggle(!newPrivacyStatus); // Revert toggle on failure
        } finally {
            setTimeout(() => {
                setToggleAPISuccess(null);
                setToggleAPIError(null);
            }, 3000);
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setError(null); // Clear previous errors
        setLoading(true); // Start loading

        // Check if passwords match
        if (data.new_password !== data.confirm_password) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // Send password update request
            await updateUserPassword({ password: data.new_password });
            setSuccess("Password updated successfully!");
            setTimeout(() => {
                setSuccess(null);
            }, 2000);
            reset(); // Reset form fields
        } catch (error) {
            setError("Failed to update password. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (apiLoading) {
        return (
            <div className="w-10 h-10 animate-[spin_1s_linear_infinite] rounded-full border-4 border-r-[#3B9DF8] border-[#3b9df84b]"></div>
        ); // Show a loading state while fetching
    }

    return (
        <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
            <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                <div className="p-2 md:p-4">
                    {apiError && (
                        <div className="p-3 flex items-center gap-3 bg-[#fdeded] rounded">
                            <MdErrorOutline className="text-[#d74242] text-[1.5rem]" />
                            <p className="text-[#d74242] text-[1rem]">
                                {apiError}
                            </p>
                        </div>
                    )}
                    <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                        <h2 className=" text-2xl font-bold sm:text-xl">
                            Change Password
                        </h2>
                        <small>Update your password here</small>
                        <div className="grid max-w-2xl mx-auto mt-2">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="mt-8 sm:mt-14 text-[#202142]"
                            >
                                {error && (
                                    <p className="text-red-500 text-sm mb-4">
                                        {error}
                                    </p>
                                )}
                                {success && (
                                    <p className="text-emerald-600 text-sm mb-4">
                                        {success}
                                    </p>
                                )}

                                <div className="mb-2 sm:mb-6">
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-indigo-900"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                        {...register("new_password", {
                                            required: "Password is required",
                                        })}
                                    />
                                    {errors.new_password && (
                                        <span className="text-red-500 text-sm">
                                            {errors.new_password.message}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-2 sm:mb-6">
                                    <label
                                        htmlFor="confirm_password"
                                        className="block mb-2 text-sm font-medium text-indigo-900"
                                    >
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm_password"
                                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                        {...register("confirm_password", {
                                            required:
                                                "Please confirm your password",
                                        })}
                                    />
                                    {errors.confirm_password && (
                                        <span className="text-red-500 text-sm">
                                            {errors.confirm_password.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-slate-200"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <h2 className=" text-2xl font-bold sm:text-xl">
                                Privacy Settings
                            </h2>
                            <small>
                                If turned on, community chat users will not see
                                your name and image
                            </small>
                            <div
                                className={`${
                                    toggle ? " bg-indigo-500" : "bg-[#f0f0f0]"
                                } w-[55px] h-[30px] py-[0.100rem] px-[0.200rem] border transition-colors duration-500 border-[#e5eaf2] rounded-lg relative`}
                            >
                                <div
                                    className={`${
                                        toggle
                                            ? " translate-x-[24px] rotate-[90deg]"
                                            : "translate-x-[0px] rotate-[0deg]"
                                    } w-[23px] h-[25px] transition-all duration-500 rounded-md cursor-pointer bg-[#fff]`}
                                    style={{
                                        boxShadow:
                                            "1px 2px 5px 2px rgb(0,0,0,0.1)",
                                    }}
                                    onClick={handlePrivacyToggle} // Call the method here
                                ></div>
                            </div>
                            {toggleAPIError && (
                                <div className="p-3 flex items-center gap-3 bg-[#fdeded] rounded">
                                    <MdErrorOutline className="text-[#d74242] " />
                                    <p className="text-[#d74242] ">
                                        {toggleAPIError}
                                    </p>
                                </div>
                            )}
                            {toggleAPISuccess && (
                                <div className=" p-3 flex items-center gap-3 bg-[#edf7ed] rounded">
                                    <IoCheckmarkDoneCircleOutline className="text-[#418944] " />
                                    <p className="text-[#418944] ">
                                        {toggleAPISuccess}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
