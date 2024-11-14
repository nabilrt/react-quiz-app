import React, { useEffect, useState } from "react";
import { getAllQuizzes } from "../lib/api/index"; // Replace with actual path to your API
import { Quiz } from "../data/types"; // Import the Quiz type
import QuizTopic from "../components/QuizTopic";

const QuizIndex: React.FC = () => {
    const [quizTopics, setQuizTopics] = useState<Quiz[]>([]);

    const getQuizzes = async () => {
        try {
            const response = await getAllQuizzes();
            setQuizTopics(response.data); // Set fetched quizzes
        } catch (error: any) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getQuizzes();
    }, []);

    return (
        <section className="bg-white " id="quiz">
            <div className="py-8 px-4 mx-auto max-w-screen-2xl sm:py-16 lg:px-6">
                <div className="max-w-screen-md mb-8 lg:mb-16 font-manrope">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
                        Choose from one of the languages listed below
                    </h2>
                    <p className="text-gray-500 sm:text-xl">
                        Each language has quizzes on different topics, ranging
                        from beginner to advanced levels. Click on the arrow
                        icon to get started.
                    </p>
                </div>
                <div className="font-inter grid max-w-screen-2xl mt-8 mx-auto space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0">
                    {quizTopics.map((quiz) => (
                        <QuizTopic key={quiz._id} quiz={quiz} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuizIndex;
