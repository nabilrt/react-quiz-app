import { useEffect, useState } from "react";
import { getUserAnalytics } from "../lib/api";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { FaStar, FaListUl, FaCheckCircle } from "react-icons/fa";

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Define types for API response structure
interface SingleValues {
    totalQuizzes: number;
    averageScore: string;
    overallAccuracy: string;
    mostAttemptedCategory: string;
}

interface ScoreDistributionItem {
    topic: string;
    averageScore: string;
}

interface AccuracyOverTimeItem {
    date: string;
    accuracy: string;
    topic: string;
    category: string;
}

interface AttemptsPerCategoryItem {
    topic: string;
    category: string;
    attempts: number;
}

interface AttemptsPerTopicItem {
    topic: string;
    attempts: number;
}

interface CorrectIncorrectItem {
    topic: string;
    category: string;
    correct: number;
    incorrect: number;
}

interface Top5Data {
    topAverageScoreTopics: ScoreDistributionItem[];
    topMostAttemptedCategories: AttemptsPerCategoryItem[];
    topCategoriesByCorrectAnswers: CorrectIncorrectItem[];
}

interface ChartData {
    scoreDistribution: ScoreDistributionItem[];
    accuracyOverTime: AccuracyOverTimeItem[];
    attemptsPerCategory: AttemptsPerCategoryItem[];
    correctIncorrectChartData: CorrectIncorrectItem[];
    attemptsPerTopic: AttemptsPerTopicItem[];
}

interface AnalyticsResponse {
    singleValues: SingleValues;
    chartData: ChartData;
    top5Data: Top5Data;
}

const UserDashboard: React.FC = () => {
    const [singleValues, setSingleValues] = useState<SingleValues | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [top5Data, setTop5Data] = useState<Top5Data | null>(null);
    const [activeTab, setActiveTab] = useState<
        "score" | "attempts" | "correct"
    >("score");

    const getQuizAnalytics = async () => {
        try {
            const response = await getUserAnalytics();
            const data: AnalyticsResponse = response.data;
            setSingleValues(data.singleValues);
            setChartData(data.chartData);
            setTop5Data(data.top5Data);
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        getQuizAnalytics();
    }, []);

    // Prepare chart data configurations
    const scoreDistributionData = {
        labels: chartData?.scoreDistribution.map((item) => item.topic),
        datasets: [
            {
                label: "Average Score",
                data: chartData?.scoreDistribution.map((item) =>
                    parseFloat(item.averageScore)
                ),
                backgroundColor: "rgba(75, 192, 192, 0.6)", // Customize color as needed
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const topicColors = chartData?.attemptsPerTopic.map(
        (_, index) =>
            `hsl(${
                (index * 360) / chartData.attemptsPerTopic.length
            }, 70%, 60%)`
    );

    const attemptsPerTopicData = {
        labels: chartData?.attemptsPerTopic.map((item) => item.topic),
        datasets: [
            {
                label: "Attempts",
                data: chartData?.attemptsPerTopic.map((item) => item.attempts),
                backgroundColor: topicColors,
            },
        ],
    };

    // Generate distinct colors for each category in attempts per category chart
    const categoryColors = chartData?.attemptsPerCategory.map(
        (_, index) =>
            `hsl(${
                (index * 360) / chartData.attemptsPerCategory.length
            }, 70%, 60%)`
    );

    const attemptsPerCategoryData = {
        labels: chartData?.attemptsPerCategory.map(
            (item) => `${item.topic} - ${item.category}`
        ),
        datasets: [
            {
                label: "Attempts",
                data: chartData?.attemptsPerCategory.map(
                    (item) => item.attempts
                ),
                backgroundColor: categoryColors,
            },
        ],
    };

    const renderTop5Content = () => {
        if (!top5Data) return null;

        const containerStyle = "h-44 overflow-y-auto"; // Fixed height and scrollable content
        const contentStyle =
            "flex items-center p-4 bg-gray-100 rounded-lg shadow-md mb-4";
        const iconStyle = "text-blue-500 text-lg mr-3";
        const labelStyle = "font-semibold text-gray-800";
        const valueStyle = "ml-auto font-bold text-gray-700";

        switch (activeTab) {
            case "score":
                return (
                    <div className={containerStyle}>
                        {top5Data?.topAverageScoreTopics.map((item, index) => (
                            <div key={index} className={contentStyle}>
                                <FaStar className={iconStyle} />
                                <span className={labelStyle}>{item.topic}</span>
                                <span className={valueStyle}>
                                    {item.averageScore}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            case "attempts":
                return (
                    <div className={containerStyle}>
                        {top5Data?.topMostAttemptedCategories.map(
                            (item, index) => (
                                <div key={index} className={contentStyle}>
                                    <FaListUl className={iconStyle} />
                                    <span className={labelStyle}>
                                        {item.topic} - {item.category}
                                    </span>
                                    <span className={valueStyle}>
                                        {item.attempts} attempts
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                );
            case "correct":
                return (
                    <div className={containerStyle}>
                        {top5Data?.topCategoriesByCorrectAnswers.map(
                            (item, index) => (
                                <div key={index} className={contentStyle}>
                                    <FaCheckCircle className={iconStyle} />
                                    <span className={labelStyle}>
                                        {item.topic} - {item.category}
                                    </span>
                                    <span className={valueStyle}>
                                        {item.correct} correct answers
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white h-screen no-scrollbar w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
            <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                <div className="p-2 md:p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        User Quiz Analytics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-manrope">
                        <div className="p-4 h-24 bg-gray-100 rounded shadow">
                            <h3 className="font-bold mb-1">Total Quizzes</h3>
                            <p>{singleValues?.totalQuizzes}</p>
                        </div>
                        <div className="p-4 h-24 bg-gray-100 rounded shadow">
                            <h3 className="font-bold mb-1">Average Score</h3>
                            <p>{singleValues?.averageScore}</p>
                        </div>
                        <div className="p-4 h-24 bg-gray-100 rounded shadow">
                            <h3 className="font-bold mb-1">Overall Accuracy</h3>
                            <p>{singleValues?.overallAccuracy}%</p>
                        </div>
                        <div className="p-4 h-24 bg-gray-100 rounded shadow">
                            <h3 className="font-bold mb-1">
                                Most Attempted Category
                            </h3>
                            <p>{singleValues?.mostAttemptedCategory}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 font-lexend md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2  ">
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">
                                Attempts Per Category
                            </h3>
                            <Pie
                                data={attemptsPerCategoryData}
                                options={{
                                    responsive: true,
                                }}
                                height={300}
                                width={400}
                            />
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">
                                Attempts Per Topic
                            </h3>
                            <Pie
                                data={attemptsPerTopicData}
                                options={{
                                    responsive: true,
                                }}
                                height={300}
                                width={400}
                            />
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">
                                Average Score Distribution
                            </h3>
                            <Bar
                                data={scoreDistributionData}
                                options={{
                                    responsive: true,
                                }}
                                height={250}
                                width={400}
                            />
                        </div>
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">
                                Top 5 Data
                            </h3>
                            <div className="flex space-x-4 mb-4">
                                <button
                                    onClick={() => setActiveTab("score")}
                                    className={`px-4 py-2 h-20 ${
                                        activeTab === "score"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    Top Average Scores
                                </button>
                                <button
                                    onClick={() => setActiveTab("attempts")}
                                    className={`px-4 py-2 h-20 ${
                                        activeTab === "attempts"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    Most Attempted Categories
                                </button>
                                <button
                                    onClick={() => setActiveTab("correct")}
                                    className={`px-4 py-2 h-20 ${
                                        activeTab === "correct"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    Top Categories by Correct Answers
                                </button>
                            </div>
                            <div className="bg-gray-100 p-4 rounded shadow">
                                {renderTop5Content()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
