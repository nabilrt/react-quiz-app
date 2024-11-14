import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { Quiz } from "../data/types";

interface QuizCardProps {
    quiz: Quiz;
}

const QuizTopic: React.FC<QuizCardProps> = ({ quiz }) => {
    return (
        <div className="relative bg-white shadow-md rounded-xl max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto">
            <img
                src={quiz.logo}
                alt={`${quiz.topic} logo`}
                className="w-full h-[100px] object-contain rounded-t-xl"
            />
            <div className="p-4">
                <h1 className="text-[1.3rem] font-bold leading-[34px]">
                    {quiz.topic}
                </h1>
                <p className="text-[0.9rem] text-gray-400">{quiz.info}</p>
            </div>
            <Link
                to={`/user/quiz/${quiz._id}`}
                className="float-right p-2 hover:bg-gray-100 cursor-pointer mr-2 mb-2 rounded-full group"
            >
                <BsArrowRight className="text-[1.5rem] text-gray-400" />
            </Link>
        </div>
    );
};

export default QuizTopic;
