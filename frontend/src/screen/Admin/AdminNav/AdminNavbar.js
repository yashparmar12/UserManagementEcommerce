import React from 'react'
import { Link, NavLink } from "react-router-dom";

const AdminNavbar = () => {


    return (
        <div>
            <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative z-50">
                <div className="flex flex-wrap items-center justify-between gap-5 w-full">
                    <div
                        id="collapseMenu"
                        className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
                    >
                        <ul className="lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                                <NavLink
                                    to="/admin/adminPage"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-[#5dade2] font-bold block text-[15px] border-b-2 border-[#5dade2]"
                                            : "text-gray-500 hover:text-[#5dade2] block font-semibold text-[15px]"
                                    }
                                >
                                    Users
                                </NavLink>
                            </li>
                            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3 mr-10">
                                <NavLink
                                    to="/admin/adminDetail"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-[#5dade2] font-bold block text-[15px] border-b-2 border-[#5dade2]"
                                            : "text-gray-500 hover:text-[#5dade2] block font-semibold text-[15px]"
                                    }
                                >
                                    Admin Profile
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="flex max-lg:ml-auto space-x-3">
                        <button className="px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-[#5dade2] bg-[#5dade2] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#5dade2]">
                            <NavLink to="/logout">Logout</NavLink>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
};



export default AdminNavbar