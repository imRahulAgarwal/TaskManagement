import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = ({ show }) => {
    const { user } = useSelector((state) => state.auth);

    const sideBarLinks = [
        {
            element: (
                <li className="relative" key={"Dashboard"}>
                    <NavLink to={"/"} className={({ isActive }) => `py-2.5 px-6 hover:text-indigo-500 flex items-center ${isActive ? "text-indigo-500" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline-block h-4 w-4 me-2 bi bi-house-door" viewBox="0 0 16 16">
                            <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"></path>
                        </svg>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
            ),
            show: user?.role === "Admin" ? true : false,
        },
        {
            element: (
                <li className="relative" key={"Tasks"}>
                    <NavLink to={"/tasks"} className={({ isActive }) => `py-2.5 px-6 hover:text-indigo-500 flex items-center ${isActive ? "text-indigo-500" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline-block h-4 w-4 me-2 bi bi-house-door" viewBox="0 0 512 512">
                            <path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                        </svg>
                        <span>Tasks</span>
                    </NavLink>
                </li>
            ),
            show: true,
        },
        {
            element: (
                <li className="relative" key={"Members"}>
                    <NavLink to={"/members"} className={({ isActive }) => `py-2.5 px-6 hover:text-indigo-500 flex items-center ${isActive ? "text-indigo-500" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline-block h-4 w-4 me-2 bi bi-house-door" viewBox="0 0 640 512">
                            <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z" />
                        </svg>
                        <span>Members</span>
                    </NavLink>
                </li>
            ),
            show: user?.role === "Admin" ? true : false,
        },
    ];

    return (
        <div className={`fixed transition-all duration-500 ease-in-out h-screen bg-white shadow-sm w-64 ${show ? "md:ms-0" : "-ms-64"}`}>
            <div className="h-full overflow-y-auto">
                <div className="text-center py-3 text-2xl flex" id="marquee">
                    <span>Task Management By Rahul</span>
                    <span>Task Management By Rahul</span>
                    <span>Task Management By Rahul</span>
                </div>

                <ul className="w-full float-none flex flex-col font-medium ps-1.5">{sideBarLinks.map((link) => link.show && link.element)}</ul>
            </div>
        </div>
    );
};

export default Sidebar;
