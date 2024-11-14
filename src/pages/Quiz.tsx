import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { quiz_data } from "../data/data"; // Assume quiz_data is typed as Quiz[]
import { Quiz, Category } from "../data/types"; // Import types if placed in a separate file
import OptionCard from "../components/OptionCard";
import QuizCategorySelection from "../components/QuizCategorySelection";
import TimerProgress from "../components/TimerProgress";
import ReturnIcon from "../icons/ReturnIcon";
import CrossIcon from "../icons/CrossIcon";
import ScoreSection from "../components/ScoreSection";
import { getQuizByTopic, storeQuizRecord } from "../lib/api";
import { useAuth } from "../lib/context/auth-context";

type Params = {
    id: string;
};
const shuffleArray = <T,>(array: T[]): T[] => {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

const QuizPage: React.FC = () => {
    const { id } = useParams<Params>();
    const [quizCategories, setQuizCategories] = useState<Category[]>([]);
    const [quizId, setQuizId] = useState<string | null>("");

    const [selectedQuiz, setSelectedQuiz] = useState<Category | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
    const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(15); // Timer for each question
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getQuizByTopic(id);
                setQuizCategories(response.data.categories);
                setQuizId(response.data._id);
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
                        <button
                            onClick={() => {
                                setIsQuizComplete(false);
                                setSelectedQuiz(null);
                            }}
                            className="mt-8 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Back to Categories
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default QuizPage;
