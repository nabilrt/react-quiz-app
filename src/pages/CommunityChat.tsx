import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
    getAllMessages,
    sendMessage,
    getUserAnalyticsCommunity,
} from "../lib/api";
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../lib/context/auth-context";
import { FaListUl, FaStar } from "react-icons/fa6";

interface Message {
    userId: {
        _id: string;
        name: string;
        avatar?: string;
        privacy?: boolean;
    };
    message: string;
    createdAt: string;
}

interface NewMessage {
    userId: string | undefined;
    message: string;
}

interface UserAnalytics {
    singleValues: {
        totalQuizzes: number;
        averageScore: string;
        overallAccuracy: string;
        mostAttemptedCategory: string;
    };
    top5Data: {
        topAverageScoreTopics: { topic: string; averageScore: string }[];
        topMostAttemptedCategories: {
            topic: string;
            category: string;
            attempts: number;
        }[];
        topCategoriesByCorrectAnswers: {
            topic: string;
            category: string;
            correct: number;
        }[];
    };
}
// Initialize socket connection

const DEFAULT_AVATAR_URL =
    "https://res.cloudinary.com/ddedulzz1/image/upload/v1729602082/ze1tjbf1plkctqgzn8zz.png";
const CommunityChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [activeUsers, setActiveUsers] = useState<string[] | null>([]);
    const [showSplash, setShowSplash] = useState<boolean>(true);
    const [progress, setProgress] = useState<number>(0);
    const [selectedUserAnalytics, setSelectedUserAnalytics] =
        useState<UserAnalytics | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<Message["userId"] | null>(
        null
    );
    const [activeTab, setActiveTab] = useState<
        "score" | "attempts" | "correct"
    >("score");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth();

    useEffect(() => {
        // Splash screen logic
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setShowSplash(false); // Hide splash screen after 5 seconds
                }
                return prev + 2; // Increase progress by 2% every 100ms
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (showSplash) return;

        const socketInstance = io("http://localhost:9000"); // Replace with your backend's URL

        // Listen for incoming messages
        socketInstance.on("new_message", (data: { message: Message }) => {
            console.log(data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [showSplash]);

    useEffect(() => {
        if (showSplash) return;

        // Fetch initial messages
        const fetchMessages = async () => {
            try {
                const response = await getAllMessages();
                setMessages(response.data.data); // Assuming response.data.data contains the messages
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [showSplash]);

    useEffect(() => {
        if (showSplash || !user?._id) return;

        const socket = io("http://localhost:9000"); // Replace with your backend's URL

        // Emit user connection after establishing the socket connection
        socket.emit("userConnected", user._id);

        // Listen for the updated list of active users
        socket.on("activeUsers", (users) => {
            setActiveUsers(users);
        });

        // Clean up the socket connection and listeners when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, [showSplash, user?._id]);

    useEffect(() => {
        // Scroll to the bottom whenever messages update
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const payload: NewMessage = {
                userId: user?._id, // Replace with logged-in user's ID
                message: newMessage.trim(),
            };
            await sendMessage(payload);
            setNewMessage(""); // Clear input field
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleUserClick = async (userId: Message["userId"]) => {
        if (!userId || userId._id === user?._id) return; // Do nothing if the user clicks on their own name

        try {
            setSelectedUser(userId);
            const response = await getUserAnalyticsCommunity(userId._id);
            setSelectedUserAnalytics(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching user analytics:", error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUserAnalytics(null);
    };

    const renderTop5Content = () => {
        if (!selectedUserAnalytics?.top5Data) return null;

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
                        {selectedUserAnalytics?.top5Data.topAverageScoreTopics.map(
                            (item, index) => (
                                <div key={index} className={contentStyle}>
                                    <FaStar className={iconStyle} />
                                    <span className={labelStyle}>
                                        {item.topic}
                                    </span>
                                    <span className={valueStyle}>
                                        {item.averageScore}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                );
            case "attempts":
                return (
                    <div className={containerStyle}>
                        {selectedUserAnalytics?.top5Data.topMostAttemptedCategories.map(
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
                        {selectedUserAnalytics?.top5Data.topCategoriesByCorrectAnswers.map(
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

    if (showSplash) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h1 className="text-3xl font-bold mb-4">
                    Community Chat Rules
                </h1>
                <ul className="mb-6 text-lg text-gray-700">
                    <li>1. Be respectful to everyone.</li>
                    <li>2. No spamming or advertising.</li>
                    <li>3. Use appropriate language.</li>
                    <li>4. Report any suspicious activity.</li>
                </ul>
                <div className="w-full max-w-md bg-gray-300 rounded-full h-4">
                    <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{progress}%</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100 p-4">
            <h1 className="text-2xl font-semibold mb-4">Community Chat</h1>
            <div className="flex-1 overflow-y-auto bg-white rounded-md shadow p-4">
                {messages.map((msg) => (
                    <div
                        key={msg.createdAt}
                        className={`flex items-start mb-4 ${
                            msg.userId._id === user?._id
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        {msg.userId._id !== user?._id && (
                            <div className="relative inline-block">
                                <img
                                    src={
                                        msg.userId.privacy
                                            ? DEFAULT_AVATAR_URL
                                            : msg.userId.avatar
                                    }
                                    alt={msg.userId.name}
                                    className="w-8 h-8 rounded-full mr-2 cursor-pointer"
                                    onClick={() => handleUserClick(msg.userId)}
                                />
                                {/* Show active icon if user is in activeUsers */}
                                {activeUsers?.includes(msg.userId._id) && (
                                    <span
                                        className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"
                                        title="Active"
                                    ></span>
                                )}
                            </div>
                        )}
                        <div
                            className={`p-2 rounded-lg ${
                                msg.userId._id === user?._id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-black"
                            }`}
                        >
                            {msg.userId._id !== user?._id && (
                                <p
                                    className="text-sm font-medium cursor-pointer"
                                    onClick={() => handleUserClick(msg.userId)}
                                >
                                    {msg.userId.privacy
                                        ? "Anonymous"
                                        : msg.userId.name}
                                </p>
                            )}

                            <p className="text-sm">{msg.message}</p>
                            <span className="text-xs text-gray-500">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="mt-4 flex items-center">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-l-md"
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                    <FaPaperPlane />
                </button>
            </div>
            {showModal && selectedUserAnalytics && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {selectedUser.privacy
                                    ? "Annonymous User"
                                    : selectedUser.name}
                                's Analytics
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 text-xl"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="text-center mb-3">
                            <img
                                src={
                                    selectedUser.privacy
                                        ? DEFAULT_AVATAR_URL
                                        : selectedUser.avatar
                                }
                                alt={selectedUser.name}
                                className="w-14 h-16 rounded-full mx-auto mb-4"
                            />
                            <h3 className="text-lg font-medium">
                                {selectedUser.privacy
                                    ? "Annonymous User"
                                    : selectedUser.name}
                            </h3>
                            {selectedUser.privacy && (
                                <small>
                                    This user has turned on her privacy settings
                                </small>
                            )}
                        </div>

                        {/* Single Values */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-manrope">
                            <div className="p-4  bg-gray-100 rounded shadow">
                                <h3 className="font-bold mb-1">
                                    Total Quizzes
                                </h3>
                                <p>
                                    {
                                        selectedUserAnalytics.singleValues
                                            .totalQuizzes
                                    }
                                </p>
                            </div>
                            <div className="p-4  bg-gray-100 rounded shadow">
                                <h3 className="font-bold mb-1">
                                    Average Score
                                </h3>
                                <p>
                                    {
                                        selectedUserAnalytics.singleValues
                                            .averageScore
                                    }
                                </p>
                            </div>
                            <div className="p-4  bg-gray-100 rounded shadow">
                                <h3 className="font-bold mb-1">
                                    Overall Accuracy
                                </h3>
                                <p>
                                    {
                                        selectedUserAnalytics.singleValues
                                            .overallAccuracy
                                    }
                                    %
                                </p>
                            </div>
                            <div className="p-4  bg-gray-100 rounded shadow">
                                <h3 className="font-bold mb-1">
                                    Most Attempted Category
                                </h3>
                                <p>
                                    {
                                        selectedUserAnalytics.singleValues
                                            .mostAttemptedCategory
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Top 5 Data */}
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
                            <div className="bg-gray-100 p-4 rounded shadow w-full">
                                {renderTop5Content()}
                            </div>
                        </div>

                        {/* Chart Section */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityChat;
