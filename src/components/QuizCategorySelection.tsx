// components/QuizCategorySelection.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import QuizCategoryCard from "./QuizCategoryCard";
import { Category } from "../data/types";
import ReturnIcon from "../icons/ReturnIcon";

type QuizCategorySelectionProps = {
    quizCategories: Category[]; // Use Category type directly
    startQuiz: (quiz: Category) => void; // Ensure compatibility with startQuiz in QuizPage
};

const QuizCategorySelection: React.FC<QuizCategorySelectionProps> = ({
    quizCategories,
    startQuiz,
}) => {
    const navigate = useNavigate();

    return (
        <div className="py-8 px-4 mx-auto max-w-screen-2xl sm:py-16 lg:px-6">
            <div className="max-w-screen-2xl mb-8 lg:mb-16 font-manrope">
                <button
                    type="button"
                    className="text-black hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mb-2"
                    onClick={() => navigate("/user/quiz")}
                >
                    <ReturnIcon />
                </button>

                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
                    Choose from one of the topics
                </h2>
                <p className="text-gray-500 sm:text-xl">
                    There are several categories of quizzes that range from
                    Beginner to Advanced Level. Choose based on your expertise.
                </p>
            </div>

            <div className="font-inter grid max-w-screen-2xl mx-auto space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0">
                {quizCategories
                    .filter(
                        (quiz) => quiz.questions && quiz.questions.length > 0
                    )
                    .map((quiz, index) => (
                        <QuizCategoryCard
                            key={index}
                            quiz={quiz}
                            onClick={() => startQuiz(quiz)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default QuizCategorySelection;
