import { useEffect, useState } from "react";
import { useAuth } from "../lib/context/auth-context";
import { showIssuesByUser } from "../lib/api";
import NoContent from "../components/NoContent";
import {
    IoTime,
    IoSync,
    IoCheckmarkCircle,
    IoCloseCircle,
} from "react-icons/io5";

// Define the types for the issues and their details
interface QuizDetails {
    _id: string;
    topic: string;
    categoryName: string;
}

interface Issue {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    quizDetails: QuizDetails;
}

const IssuesPage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await showIssuesByUser(user?._id);
                setIssues(response.data.issues);
            } catch (error: any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (user?._id) {
            getData();
        }
    }, [user?._id]);

    const getStatusChip = (status: string) => {
        switch (status) {
            case "Open":
                return (
                    <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-50 text-blue-800 rounded-full text-[0.9rem] font-[500]">
                        <IoTime className="text-[1.1rem] text-blue-800" />
                        Open
                    </div>
                );
            case "In Progress":
                return (
                    <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-yellow-50 text-yellow-800 rounded-full text-[0.9rem] font-[500]">
                        <IoSync className="text-[1.1rem] text-yellow-800" />
                        In Progress
                    </div>
                );
            case "Resolved":
                return (
                    <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-green-50 text-green-800 rounded-full text-[0.9rem] font-[500]">
                        <IoCheckmarkCircle className="text-[1.1rem] text-green-800" />
                        Resolved
                    </div>
                );
            case "Closed":
                return (
                    <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-red-50 text-red-800 rounded-full text-[0.9rem] font-[500]">
                        <IoCloseCircle className="text-[1.1rem] text-red-800" />
                        Closed
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading && issues.length === 0) {
        return (
            <div className="w-10 h-10 animate-[spin_1s_linear_infinite] rounded-full border-4 border-r-[#3B9DF8] border-[#3b9df84b]"></div>
        );
    }

    // Render if no issues are available
    if (!loading && issues.length === 0) {
        return (
            <NoContent>
                <h1 className="text-[1.4rem] mt-6 font-[500] text-black">
                    No Issue Found
                </h1>
                <p className="text-[0.9rem] text-gray-500">
                    Report One Issue to see here!
                </p>
            </NoContent>
        );
    }

    return (
        <div className="w-screen">
            <h1 className="text-[1.5rem] font-semibold">My Issues</h1>
            <div className="mt-4">
                <ul>
                    <div className="flex flex-col">
                        <div className="-my-2  sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="w-full table-auto divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Title
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {issues.map((issue) => (
                                                <tr key={issue._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {issue.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {getStatusChip(
                                                            issue.status
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                                        {issue.description}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default IssuesPage;
