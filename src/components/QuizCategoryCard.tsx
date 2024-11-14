import React from "react";

type QuizCategory = {
    category: string;
    info: string;
};

type QuizCategoryCardProps = {
    quiz: QuizCategory;
    onClick: () => void;
};

const QuizCategoryCard: React.FC<QuizCategoryCardProps> = ({
    quiz,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer relative bg-white shadow-md rounded-xl transition-transform transform hover:scale-105 w-64 sm:w-72 md:w-80 lg:w-96 mx-auto "
        >
            <div className="p-4 md:p-6 lg:p-8">
                <h1 className="text-[1.2rem] md:text-[1.4rem] lg:text-[1.5rem] font-bold leading-tight md:leading-snug lg:leading-normal">
                    {quiz.category}
                </h1>
                <p className="text-[0.85rem] md:text-[0.95rem] lg:text-[1rem] text-gray-400 mt-2">
                    {quiz.info}
                </p>
            </div>
        </div>
    );
};

export default QuizCategoryCard;
