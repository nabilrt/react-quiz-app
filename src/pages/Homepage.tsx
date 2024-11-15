import HeroSection from "../components/HeroSection";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getActiveTestimonials, getAllQuizzes } from "../lib/api";
import { Quiz, Testimonial } from "../data/types"; // Import updated types
import NoContent from "../components/NoContent";
import QuizTopic from "../components/QuizTopic";
import { FaQuoteLeft, FaStar, FaRegStar } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa6";
import Loader from "../components/Loader";

const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [quizTopics, setQuizTopics] = useState<Quiz[]>([]);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const testimonialResponse = await getActiveTestimonials();
                const quizResponse = await getAllQuizzes();
                setTestimonials(testimonialResponse.data.activeTestimonials);
                setQuizTopics(quizResponse.data); // Set fetched quizzes
            } catch (error: any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                i < rating ? (
                    <FaStar key={i} className="text-[1.3rem] text-[#ffba24]" />
                ) : (
                    <FaRegStar
                        key={i}
                        className="text-[1.3rem] text-[#ffba24]"
                    />
                )
            );
        }
        return stars;
    };

    return (
        <div>
            <div className="font-manrope w-full mb-4">
                <Header />
            </div>
            <section className="bg-white font-inter">
                <HeroSection />
            </section>
            {loading ? (
                <Loader />
            ) : (
                <section className="bg-white" id="quiz">
                    <div className="py-8 px-4 mx-auto max-w-screen-2xl sm:py-16 lg:px-6">
                        <div className="max-w-screen-md mb-8 lg:mb-16 font-manrope">
                            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
                                Choose from one of the language listed below
                            </h2>
                            <p className="text-gray-500 sm:text-xl">
                                Each Language has quizzes on different topics
                                which are from beginner level to advanced. Click
                                on the arrow icon to get started. You need to
                                have an account!
                            </p>
                        </div>
                        {quizTopics.length === 0 && (
                            <NoContent>
                                <h1 className="text-[1.4rem] mt-6 font-[500] text-black">
                                    No Topics Found
                                </h1>
                                <p className="text-[0.9rem] text-gray-500">
                                    Please wait until admin adds new topics for
                                    quiz
                                </p>
                            </NoContent>
                        )}
                        <div className="font-inter grid max-w-screen-2xl mt-8 mx-auto space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0">
                            {quizTopics?.map((quiz) => (
                                <QuizTopic key={quiz._id} quiz={quiz} />
                            ))}
                        </div>

                        {/* Testimonial Section */}
                        <div className="mt-6 mb-8 lg:mb-16 font-manrope">
                            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
                                What people are saying
                            </h2>
                            <div className="font-lexend grid mt-8 mx-auto space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0">
                                {testimonials.map((testimonial) => (
                                    <div
                                        key={testimonial._id}
                                        className="bg-secondary shadow-2xl rounded-lg p-6 flex items-center justify-center flex-col"
                                    >
                                        <img
                                            src={testimonial.userId.avatar}
                                            alt={`${testimonial.userId.name}'s avatar`}
                                            className="w-[150px] h-[150px] object-cover rounded-full"
                                        />
                                        <h3 className="text-[1.5rem] font-[500] capitalize mt-4">
                                            {testimonial.userId.name}
                                        </h3>

                                        <div className="flex items-center gap-1 my-4">
                                            {renderStars(testimonial.rating)}
                                        </div>
                                        <div className="relative">
                                            <p className="text-justify text-[0.9rem] my-3 text-text">
                                                {testimonial.text}
                                            </p>
                                            <FaQuoteRight className="text-[3rem] text-[#d1d1d169] absolute top-[-20%] left-0" />
                                            <FaQuoteLeft className="text-[3rem] text-[#d1d1d169] absolute bottom-[0%] right-0" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;
