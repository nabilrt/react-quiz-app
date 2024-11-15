import { Link, useLocation } from "react-router-dom";

const Header = () => {
    let { pathname } = useLocation();
    return (
        <div className=" -mt-8  flex justify-between mx-auto max-w-screen-2xl sm:py-16 lg:px-6 font-manrope ">
            <Link to={"/"}>
                <p className="font-bold text-xl tracking-wider">Quizzy</p>
            </Link>

            <div className="ml-auto flex gap-2">
                <>
                    {pathname !== "/login" && (
                        <Link
                            to={"/login"}
                            className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-primary transition duration-300 ease-out border-2 border-primary rounded-full shadow-md group"
                        >
                            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    ></path>
                                </svg>
                            </span>
                            <span className="absolute flex items-center justify-center w-full h-full text-primary transition-all duration-300 transform group-hover:translate-x-full ease">
                                Login
                            </span>
                            <span className="relative invisible">Login</span>
                        </Link>
                    )}
                    {pathname !== "/register" && (
                        <Link
                            to="/register"
                            className="relative inline-flex items-center px-8 py-2.5 overflow-hidden text-lg font-medium text-primary border-2 border-primary rounded-full hover:text-white group hover:bg-gray-50"
                        >
                            <span className="absolute left-0 block w-full h-0 transition-all bg-primary opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                            <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    ></path>
                                </svg>
                            </span>
                            <span className="relative text-[1rem] group-hover:pr-4 transition-all duration-400">
                                Register
                            </span>
                        </Link>
                    )}
                </>
            </div>
        </div>
    );
};

export default Header;
