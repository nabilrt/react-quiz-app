import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllQuizzes, getLeaderboardData } from "../lib/api";
import { Quiz } from "../data/types";
import NoContent from "../components/NoContent";
import { useAuth } from "../lib/context/auth-context";
import { FaTrophy } from "react-icons/fa6";

const Leaderboard = () => {
    const [quizTopics, setQuizTopics] = useState<Quiz[]>([]);
    const [selectedTopicCategory, setSelectedTopicCategory] =
        useState<string>("");
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch all quizzes on component mount
    const getQuizzes = async () => {
        setLoading(true);
        try {
            const response = await getAllQuizzes();
            const quizzes = response.data;

            if (quizzes.length > 0) {
                // Check if a type query parameter exists in the URL
                const existingType = searchParams.get("type");

                if (!existingType) {
                    // Prepare the initial selected value
                    const firstTopic = quizzes[0];
                    const firstCategory = firstTopic.categories[0];
                    const defaultSelection = `${firstTopic.topic} - ${firstCategory.category}`;
                    setSelectedTopicCategory(defaultSelection);

                    // Update URL with default selection
                    setSearchParams({ type: defaultSelection });
                    navigate(`/user/leaderboard?type=${defaultSelection}`);
                }
            }

            setQuizTopics(quizzes);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            console.error("Error fetching quizzes:", error.message);
        }
    };

    // Fetch leaderboard data based on selected topic-category
    const fetchLeaderboard = async (type: string) => {
        try {
            const response = await getLeaderboardData(type);
            setLeaderboardData(response.data.data);
        } catch (error: any) {
            console.error("Error fetching leaderboard data:", error.message);
        }
    };

    // Effect to fetch quizzes
    useEffect(() => {
        getQuizzes();
    }, []);

    // Effect to handle URL query parameter and fetch leaderboard
    useEffect(() => {
        const type = searchParams.get("type");
        console.log(type);
        if (type) {
            setSelectedTopicCategory(type);
            fetchLeaderboard(type);
        }
    }, [searchParams]);

    // Handle dropdown change
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelection = e.target.value;

        // Update state, URL, and fetch leaderboard data
        setSelectedTopicCategory(newSelection);
        setSearchParams({ type: newSelection });
        navigate(`/user/leaderboard?type=${newSelection}`);
        fetchLeaderboard(newSelection);
    };

    if (loading && quizTopics.length === 0) {
        return (
            <div className="w-10 h-10 animate-[spin_1s_linear_infinite] rounded-full border-4 border-r-[#3B9DF8] border-[#3b9df84b]"></div>
        );
    }

    // Render if no quizzes are available
    if (!loading && quizTopics.length === 0) {
        return (
            <NoContent>
                <h1 className="text-[1.4rem] mt-6 font-[500] text-black">
                    No Topics Found
                </h1>

                <p className="text-[0.9rem] text-gray-500">
                    Please wait until admin adds new topics for quiz
                </p>
            </NoContent>
        );
    }

    return (
        <div className="bg-white py-8 px-4 mx-auto max-w-screen-2xl sm:py-16 lg:px-6 w-full">
            <h1 className="font-lexend text-xl font-semibold mb-2">
                Leaderboard
            </h1>
            <select
                value={selectedTopicCategory}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
            >
                {quizTopics.map((quiz) =>
                    quiz.categories.map((category) => (
                        <option
                            key={`${quiz.topic}-${category.category}`}
                            value={`${quiz.topic} - ${category.category}`}
                        >
                            {`${quiz.topic} - ${category.category}`}
                        </option>
                    ))
                )}
            </select>

            <div className="mt-4">
                {leaderboardData?.length > 0 ? (
                    <>
                        <h2 className="mb-2 font-manrope text-xl font-semibold">
                            Rankings
                        </h2>
                        <ul>
                            <div className="flex flex-col">
                                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Name
                                                        </th>

                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        ></th>

                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Points
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {leaderboardData.map(
                                                        (lead, index) => (
                                                            <tr
                                                                key={
                                                                    lead.userId
                                                                }
                                                                className={`${
                                                                    lead.userId ===
                                                                        user?._id &&
                                                                    "bg-emerald-300"
                                                                }`}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap ">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 h-10 w-10">
                                                                            <img
                                                                                className="w-9 h-10 rounded-md"
                                                                                src={
                                                                                    lead.userAvatar
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {
                                                                                    lead.userName
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td className="px-6 py-4 whitespace-nowrap ">
                                                                    <div className="flex items-center">
                                                                        {index ===
                                                                            0 && (
                                                                            <FaTrophy
                                                                                size={
                                                                                    25
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {
                                                                        lead.totalPoints
                                                                    }{" "}
                                                                    Points
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ul>
                    </>
                ) : (
                    <p>No leaderboard data available.</p>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
