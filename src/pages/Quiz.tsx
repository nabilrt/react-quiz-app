import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {Category } from "../data/types"; // Import types if placed in a separate file
import OptionCard from "../components/OptionCard";
import QuizCategorySelection from "../components/QuizCategorySelection";
import TimerProgress from "../components/TimerProgress";
import ReturnIcon from "../icons/ReturnIcon";
import CrossIcon from "../icons/CrossIcon";
import ScoreSection from "../components/ScoreSection";
import { addIssue, getQuizByTopic, storeQuizRecord } from "../lib/api";
import { useAuth } from "../lib/context/auth-context";
import { RxCross1 } from "react-icons/rx";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineInfo } from "react-icons/md";

type Params = {
    id: string;
};
const shuffleArray = <T,>(array: T[]): T[] => {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};
type FormValues = {
    title: string;
    description: string;
};
const QuizPage: React.FC = () => {
    const { id } = useParams<Params>();
    const [quizCategories, setQuizCategories] = useState<Category[]>([]);
    const [quizId, setQuizId] = useState<string | null>("");
    const [quizTopic, setQuizTopic] = useState<string | null>("");
    const [isModalOpen, setisModalOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const [selectedQuiz, setSelectedQuiz] = useState<Category | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
    const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(15); // Timer for each question
    const [loading, setLoading] = useState<boolean>(true);
    const [issueLoading, setIssueLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getQuizByTopic(id);
                setQuizCategories(response.data.categories);
                setQuizId(response.data._id);
                setQuizTopic(response.data.topic);
            } catch (err: any) {
                setError("Failed to load quiz categories. Please try again.");
                console.error("Error fetching quiz categories:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizCategories();
    }, [id]);

    useEffect(() => {
        let interval: any;

        if (selectedQuiz && !isQuizComplete) {
            // Reset timer to 15 seconds for each new question
            setTimer(15);
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer === 1) {
                        nextQuestion(); // Automatically move to the next question
                        return 15; // Reset timer
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval); // Clear interval on unmount or question change
        };
    }, [currentQuestionIndex, selectedQuiz, isQuizComplete]);

    const startQuiz = (quiz: Category) => {
        const shuffledQuestions = shuffleArray(quiz.questions).map(
            (question) => ({
                ...question,
                options: shuffleArray(question.options),
            })
        );
        setSelectedQuiz({ ...quiz, questions: shuffledQuestions });
        setCurrentQuestionIndex(0);
        setAnswers({});
    };

    const handleAnswerChange = (questionIndex: number, option: string) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = prevAnswers[questionIndex]
                ? [...prevAnswers[questionIndex]]
                : [];
            if (updatedAnswers.includes(option)) {
                return {
                    ...prevAnswers,
                    [questionIndex]: updatedAnswers.filter(
                        (ans) => ans !== option
                    ),
                };
            } else {
                return {
                    ...prevAnswers,
                    [questionIndex]: [...updatedAnswers, option],
                };
            }
        });
    };

    const nextQuestion = () => {
        if (
            selectedQuiz &&
            currentQuestionIndex < selectedQuiz.questions.length - 1
        ) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimer(15); // Immediately reset timer without animation
        } else {
            setIsQuizComplete(true);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setTimer(15); // Immediately reset timer without animation
        }
    };

    const calculateScore = (): number => {
        let score = 0;
        if (selectedQuiz) {
            selectedQuiz.questions.forEach((question, index) => {
                if (
                    answers[index] &&
                    question.answer.every((ans) =>
                        answers[index].includes(ans)
                    ) &&
                    answers[index].length === question.answer.length
                ) {
                    score++;
                }
            });
        }
        return score;
    };

    const calculateCorrectAnswers = (): number => {
        let correct = 0;
        if (selectedQuiz) {
            selectedQuiz.questions.forEach((question, index) => {
                if (
                    answers[index] &&
                    question.answer.every((ans) =>
                        answers[index].includes(ans)
                    ) &&
                    answers[index].length === question.answer.length
                ) {
                    correct++;
                }
            });
        }
        return correct;
    };

    const { user } = useAuth();

    const saveQuizRecord = async () => {
        if (!selectedQuiz) return;

        const quizRecordData = {
            userId: user?._id, // dynamically populate userId
            quizId: quizId, // dynamically populate quizId
            categoryId: selectedQuiz._id,
            categoryName: selectedQuiz.category,
            score: calculateScore(),
            totalQuestions: selectedQuiz.questions.length,
            correctAnswers: calculateCorrectAnswers(),
            incorrectAnswers:
                selectedQuiz.questions.length - calculateCorrectAnswers(),
            attempts: 1,
            accuracy:
                (calculateCorrectAnswers() / selectedQuiz.questions.length) *
                100,
        };

        try {
            const response = await storeQuizRecord(quizRecordData);
            console.log("Quiz record saved:", response.data);
        } catch (error) {
            console.error("Error saving quiz record:", error);
        }
    };

    const closeModal = () => {
        reset();
        setisModalOpen(false);
    };

    const [message, setMessage] = useState("");

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIssueLoading(true);
        const updatedData = {
            ...data,
            quizId: quizId,
            categoryId: selectedQuiz?._id,
        };

        try {
            await addIssue(updatedData);
            setMessage("Issue Submitted Successfully!");

            setIssueLoading(false);
        } catch (error) {
            setMessage("Issue Failed to Submit!");
            setIssueLoading(false);
            console.error("Error submitting form:", error);
        } finally {
            setTimeout(() => {
                setMessage("");
            }, 2000);
            closeModal();
        }
    };

    useEffect(() => {
        if (isQuizComplete) {
            saveQuizRecord();
        }
    }, [isQuizComplete]);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }
    return (
        <div className="">
            {!selectedQuiz && !isQuizComplete && (
                <section className="bg-white">
                    <QuizCategorySelection
                        quizCategories={quizCategories}
                        startQuiz={startQuiz}
                    />
                </section>
            )}

            {selectedQuiz && !isQuizComplete && (
                <div className="max-w-screen-2xl">
                    <section className="bg-white py-8 px-4 mx-auto  w-full">
                        <button
                            type="button"
                            className="text-black hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mb-2"
                            onClick={() => {
                                setSelectedQuiz(null);
                                setIsQuizComplete(false);
                                setTimer(15); // Immediately reset timer to 15
                            }}
                        >
                            <ReturnIcon />
                        </button>
                        <div className="mb-8 font-manrope">
                            <h2 className="text-2xl font-semibold mb-6">
                                Question {currentQuestionIndex + 1} of{" "}
                                {selectedQuiz.questions.length}
                            </h2>
                            <p className="text-gray-700 mb-4">
                                {
                                    selectedQuiz.questions[currentQuestionIndex]
                                        .question
                                }
                            </p>

                            {/* Timer Progress Bar */}
                            <TimerProgress timer={timer} totalTime={15} />

                            <div className="grid grid-cols-2 gap-2">
                                {selectedQuiz.questions[
                                    currentQuestionIndex
                                ].options.map((option, optIndex) => (
                                    <OptionCard
                                        key={optIndex}
                                        text={option.answer}
                                        checked={
                                            answers[
                                                currentQuestionIndex
                                            ]?.includes(option.answer) || false
                                        }
                                        onChange={() =>
                                            handleAnswerChange(
                                                currentQuestionIndex,
                                                option.answer
                                            )
                                        }
                                    />
                                ))}
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button
                                    onClick={prevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={nextQuestion}
                                    className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
                                >
                                    {currentQuestionIndex ===
                                    selectedQuiz.questions.length - 1
                                        ? "Finish"
                                        : "Next"}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {isQuizComplete && (
                <section className="bg-white py-8 px-4 mx-auto max-w-screen-2xl">
                    <div className="mb-8 font-manrope">
                        <ScoreSection
                            score={calculateScore()}
                            totalScore={selectedQuiz!.questions.length * 5}
                        />
                        {selectedQuiz?.questions.map((question, qIndex) => {
                            const isQuestionIncorrect = answers[qIndex]
                                ? !question.answer.every((ans) =>
                                      answers[qIndex].includes(ans)
                                  ) ||
                                  answers[qIndex].length !==
                                      question.answer.length
                                : true;

                            return (
                                <div
                                    key={qIndex}
                                    className="border border-gray-200 p-4 mb-4 rounded-lg"
                                >
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="text-lg font-semibold">
                                            {question.question}
                                        </h3>
                                        {/* Render the cross icon if the question is answered incorrectly */}
                                        {isQuestionIncorrect && <CrossIcon />}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {question.options.map(
                                            (option, optIndex) => (
                                                <OptionCard
                                                    key={optIndex}
                                                    text={option.answer}
                                                    checked={
                                                        answers[
                                                            qIndex
                                                        ]?.includes(
                                                            option.answer
                                                        ) || false
                                                    }
                                                    isCorrect={question.answer.includes(
                                                        option.answer
                                                    )}
                                                    isIncorrect={
                                                        answers[
                                                            qIndex
                                                        ]?.includes(
                                                            option.answer
                                                        ) &&
                                                        !question.answer.includes(
                                                            option.answer
                                                        )
                                                    }
                                                    onChange={() => {}}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={() => {
                                    setIsQuizComplete(false);
                                    setSelectedQuiz(null);
                                }}
                                className="mt-8 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Back to Categories
                            </button>
                            <Link
                                to={`/user/leaderboard?type=${quizTopic} - ${selectedQuiz?.category}`}
                                className="mt-8 text-white bg-emerald-500 hover:bg-emerald-700 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Go to Leaderboard
                            </Link>
                            <button
                                onClick={() => setisModalOpen(true)}
                                className="mt-8 text-white bg-pink-600 hover:bg-pink-800 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Having Issues? Click to Report!
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <div
                className={`${
                    isModalOpen ? " visible" : " invisible"
                } w-full h-screen fixed top-0 left-0 z-50 bg-[#0000002a] transition-all duration-300 flex items-center justify-center`}
            >
                <div
                    className={`${
                        isModalOpen
                            ? " scale-[1] opacity-100"
                            : " scale-[0] opacity-0"
                    } w-[90%] md:w-[80%] lg:w-[35%] bg-[#fff] rounded-lg transition-all duration-300 mx-auto mt-8`}
                >
                    <div className="w-full flex items-end p-4 justify-between ">
                        <h1 className="text-[1.5rem] font-bold">
                            Create Issue
                        </h1>
                        <button
                            className="p-2 text-[2.5rem] hover:bg-[#e7e7e7] rounded-full transition-all duration-300 cursor-pointer"
                            onClick={closeModal}
                            disabled={issueLoading}
                        >
                            <RxCross1 size={15} />
                        </button>
                    </div>
                    <form
                        className="flex flex-col gap-5 p-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {message !== "" && (
                            <div className="p-3 flex items-center gap-3 bg-[#e5f6fd] rounded mt-2 mb-2">
                                <MdOutlineInfo className="text-[#2d9dda] text-[1.5rem]" />
                                <p className="text-[#2d9dda] text-[1rem]">
                                    {message}
                                </p>
                            </div>
                        )}

                        <label htmlFor="topic">Title</label>
                        <input
                            type="text"
                            id="topic"
                            placeholder="Quiz Topic"
                            {...register("title", { required: true })}
                            className="border-[#e5eaf2] border rounded-md outline-none px-4 w-full mt-1 py-3 focus:border-[#3B9DF8] transition-colors duration-300"
                        />

                        {/* Description */}
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Write issue about the quiz"
                            {...register("description", {
                                required: true,
                            })}
                            className="border-[#e5eaf2] border rounded-md outline-none mt-1 px-4 w-full py-3 min-h-[200px] focus:border-[#3B9DF8] transition-colors duration-300"
                        ></textarea>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="py-2 px-4 w-full bg-emerald-400 hover:bg-emerald-600 text-[#fff] rounded-md"
                            >
                                <>{issueLoading ? "Loading" : "Create Issue"}</>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
