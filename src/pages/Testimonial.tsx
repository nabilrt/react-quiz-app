import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../lib/context/auth-context";
import {
    showUserTestimonial,
    createOrUpdateTestimonialByUserId,
} from "../lib/api";
import { FaStar } from "react-icons/fa6";
import { MdOutlineInfo } from "react-icons/md";

// Define the types for form data
interface TestimonialFormData {
    text: string;
    rating: number;
}

// Define the types for the fetched testimonial
interface TestimonialData {
    text: string;
    rating: number;
    status: boolean;
    createdAt: string;
    _id: string;
}

const Testimonial: React.FC = () => {
    const { user } = useAuth(); // Assume useAuth provides user information
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const { register, handleSubmit, setValue, reset } =
        useForm<TestimonialFormData>({
            defaultValues: {
                text: "",
                rating: 0,
            },
        });

    useEffect(() => {
        const getData = async () => {
            if (!user?._id) return;
            setLoading(true);
            try {
                const response = await showUserTestimonial(user._id);
                const testimonial: TestimonialData = response?.data;
                if (testimonial) {
                    setValue("text", testimonial.text);
                    setRating(testimonial.rating);
                } else {
                    reset(); // Reset the form if no testimonial exists
                }
            } catch (error) {
                console.error("Error fetching testimonial:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [user?._id, setValue, reset]);

    // Handle form submission
    const onSubmit = async (data: TestimonialFormData) => {
        if (!user?._id) return;
        try {
            const payload = {
                ...data,
                rating,
                userId: user._id,
            };
            await createOrUpdateTestimonialByUserId(user._id, payload);
            setMessage("Testimonial Upserted successfully!");
        } catch (error) {
            setMessage("Testimonial Upsertion Failed!");
            console.error("Error submitting testimonial:", error);
        } finally {
            setTimeout(() => {
                setMessage(null);
            }, 2000);
        }
    };

    return (
        <div className="bg-white boxShadow rounded-md max-w-2xl mx-10 w-full p-4 sm:p-8 font-lexend">
            <h3 className="text-[24px] font-semibold text-[#333333] text-center">
                Review Our System
            </h3>
            <p className="text-[14px] font-[400] text-gray-500 text-center">
                Please rate your experience below
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center sm:flex-row flex-col sm:space-x-12 w-full my-[20px] justify-center">
                    <div className="flex items-center space-x-6 justify-center mb-[10px]">
                        {[...Array(5)].map((_, index) => {
                            const starRating = index + 1;
                            return (
                                <FaStar
                                    key={starRating}
                                    className={`cursor-pointer ${
                                        starRating <= (hover || rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                    size={26}
                                    onClick={() => {
                                        setRating(starRating);
                                        setValue("rating", starRating); // Set form rating
                                    }}
                                    onMouseEnter={() => setHover(starRating)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            );
                        })}
                    </div>
                </div>

                <label className="text-gray-500 ">Additional feedback</label>
                <textarea
                    placeholder="My feedback!!"
                    className="w-full border-gray-400 resize-none outline-none focus:border-primary border rounded-md p-2 min-h-[100px]"
                    {...register("text", {
                        required: "Feedback is required",
                        maxLength: {
                            value: 500,
                            message: "Feedback cannot exceed 500 characters",
                        },
                    })}
                ></textarea>

                {loading && <p>Loading...</p>}

                <button
                    type="submit"
                    className={`px-6 py-2 border border-[#3B9DF8] hover:bg-[#3B9DF8] text-[#3B9DF8]
hover:text-[#ffffff]  transition duration-300 rounded w-full`}
                >
                    Submit feedback
                </button>
            </form>
            {message && (
                <div className="p-3 flex items-center gap-3 bg-[#e5f6fd] rounded mt-2">
                    <MdOutlineInfo className="text-[#2d9dda] text-[1.5rem]" />
                    <p className="text-[#2d9dda] text-[1rem]">{message}</p>
                </div>
            )}
        </div>
    );
};

export default Testimonial;
