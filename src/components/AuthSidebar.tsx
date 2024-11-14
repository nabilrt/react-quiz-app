import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { useAuth } from "../lib/context/auth-context";
import { Link } from "react-router-dom";

const AuthSidebar = ({ expanded, setExpanded }: any) => {
    const { user, logout } = useAuth();
    return (
        <aside
            className={`h-screen transition-all duration-300 fixed ease-in-out bg-white border-r shadow-sm ${
                expanded ? "w-64" : "w-16"
            }`}
        >
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <a href="#">
                        <p
                            className={`text-center text-xl font-semibold overflow-hidden transition-all duration-300 ${
                                expanded
                                    ? "w-auto opacity-100"
                                    : "w-0 opacity-0"
                            }`}
                        >
                            QUIZZY
                        </p>
                    </a>
                    <button
                        onClick={() => setExpanded((curr:any) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? <LuChevronFirst /> : <LuChevronLast />}
                    </button>
                </div>
                <ul className="flex-1 px-3">
                    <Link
                        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
                            location.pathname === "/user/dashboard"
                                ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                                : "hover:bg-indigo-50 text-gray-600"
                        }`}
                        to="/user/dashboard"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span
                            className={`overflow-hidden transition-all ${
                                expanded ? "w-52 ml-3" : "w-0"
                            }`}
                        >
                            Dashboard
                        </span>

                        {!expanded && (
                            <div
                                className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                            >
                                Dashboard
                            </div>
                        )}
                    </Link>
                    <Link
                        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
                            location.pathname.startsWith("/user/quiz")
                                ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                                : "hover:bg-indigo-50 text-gray-600"
                        }`}
                        to={"/user/quiz"}
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span
                            className={`overflow-hidden transition-all ${
                                expanded ? "w-52 ml-3" : "w-0"
                            }`}
                        >
                            Quiz
                        </span>

                        {!expanded && (
                            <div
                                className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                            >
                                Quiz
                            </div>
                        )}
                    </Link>
                    <Link
                        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
                            location.pathname === "/user/settings"
                                ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                                : "hover:bg-indigo-50 text-gray-600"
                        }`}
                        to={"/user/settings"}
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span
                            className={`overflow-hidden transition-all ${
                                expanded ? "w-52 ml-3" : "w-0"
                            }`}
                        >
                            Settings
                        </span>

                        {!expanded && (
                            <div
                                className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                            >
                                Settings
                            </div>
                        )}
                    </Link>
                    <Link
                        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
                            location.pathname === "/user/profile"
                                ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                                : "hover:bg-indigo-50 text-gray-600"
                        }`}
                        to="/user/profile"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M4 20c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span
                            className={`overflow-hidden transition-all ${
                                expanded ? "w-52 ml-3" : "w-0"
                            }`}
                        >
                            Profile
                        </span>

                        {!expanded && (
                            <div
                                className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                            >
                                Profile
                            </div>
                        )}
                    </Link>
                </ul>
                <div className="border-t flex p-3">
                    <img src={user?.avatar} className="w-10 h-10 rounded-md" />
                    <div
                        className={`flex justify-between items-center overflow-hidden transition-all ${
                            expanded ? "w-52 ml-3" : "w-0"
                        } `}
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">{user?.name}</h4>
                        </div>
                        <button
                            onClick={logout}
                            className={`flex items-center px-2 py-2 -mx-2 transform rounded-md  hover:bg-gray-200 hover:text-gray-700`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                            >
                                <path d="M16.24 7.75a.75.75 0 0 1 1.06 1.06l-3.72 3.72h8.91a.75.75 0 0 1 0 1.5h-8.91l3.72 3.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25Z" />
                                <path d="M9.25 3a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-1.5 0V3.75a.75.75 0 0 1 .75-.75Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default AuthSidebar;
