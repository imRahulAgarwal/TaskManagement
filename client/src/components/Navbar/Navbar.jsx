import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onClick, show }) => {
    const { user } = useSelector((state) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    const profileMenu = useRef(null);
    const navigate = useNavigate();

    const closeOpenMenus = (e) => {
        if (showDropdown && !profileMenu.current?.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    const handleProfileClick = () => {
        setShowDropdown(false);
        navigate("/profile");
    };

    document.addEventListener("mousedown", closeOpenMenus);

    const dispatch = useDispatch();
    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
    };

    return (
        <nav
            className={`z-50 fixed flex flex-row flex-nowrap items-center justify-between mt-0 py-2 px-6 bg-white shadow-sm transition-all duration-500 ease-in-out start-0 end-0 ${
                show ? "start-64" : ""
            }`}>
            <button type="button" className="inline-flex items-center justify-center text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-0" onClick={onClick}>
                <svg x-description="Icon sidebar" className="h-8 w-8 block" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    {!show ? (
                        <path
                            fillRule="evenodd"
                            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
                    ) : (
                        <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path>
                    )}
                </svg>
            </button>

            <ul className="flex ms-auto mt-2">
                <li className="relative" ref={profileMenu}>
                    <button className="px-3 py-1 flex text-sm rounded-full focus:outline-none" onClick={() => setShowDropdown(true)}>
                        <div className="relative">
                            {user?.image ? (
                                <img className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700" src={user?.image} alt={user?.name} />
                            ) : (
                                <div className="rounded-full w-10 h-10 bg-gray-200 border-solid border-white border-2" />
                            )}
                        </div>
                        <span className="hidden md:block ms-1 self-center">{user?.name}</span>
                    </button>
                    {showDropdown && (
                        <ul className="origin-top-right absolute end-0 rounded top-full z-50 py-0.5 text-start min-w-[13rem] bg-white shadow-md">
                            <li className="relative">
                                <div className="flex flex-wrap flex-row -mx-4 px-3 py-4 items-center">
                                    <div className="flex-shrink max-w-full px-4 w-1/3 flex justify-center relative">
                                        {user?.image ? (
                                            <img src={user?.image} className="h-10 w-10 rounded-full" alt={user?.name} />
                                        ) : (
                                            <div className="rounded-full w-10 h-10 bg-gray-200 border-solid border-white border-2" />
                                        )}
                                    </div>
                                    <div className="flex-shrink max-w-full px-4 w-2/3 ps-1">
                                        <p className="font-bold text-gray-800">{user?.name}</p>
                                        <p className="text-gray text-sm mt-1">{user?.role}</p>
                                    </div>
                                </div>
                            </li>
                            <li className="relative">
                                <hr className="border-t border-gray-200 my-0" />
                            </li>
                            <li className="relative">
                                <span onClick={handleProfileClick} className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500" href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline me-2 w-4 h-4 bi bi-gear" viewBox="0 0 448 512">
                                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                                    </svg>
                                    <i className="me-2 fas fa-cog"></i> Profile
                                </span>
                            </li>

                            <li className="relative">
                                <hr className="border-t border-gray-200 my-0" />
                            </li>
                            <li className="relative">
                                <span className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline me-2 w-4 h-4 bi bi-box-arrow-in-right" viewBox="0 0 512 512">
                                        <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                                    </svg>
                                    <i className="me-2 fas fa-sign-out-alt"></i> Log out
                                </span>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
