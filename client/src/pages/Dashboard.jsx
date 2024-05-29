import React, { useEffect, useState } from "react";
import { userService } from "../api/user";

const Dashboard = () => {
    const [dashboard, setDashboard] = useState({});

    const getInfo = async () => {
        const result = await userService.getDashboardInfo();
        if (result) return setDashboard(result);
    };

    useEffect(() => {
        getInfo();
        return () => setDashboard({});
    }, []);

    return (
        <div className="mx-auto py-2 sm:px-2">
            <div className="flex-shrink max-w-full px-4 w-full">
                <p className="text-xl font-bold mt-3 mb-5">Dashboard</p>
            </div>
            <div className="flex flex-wrap flex-row">
                <div className="flex-shrink max-w-full w-full order-2 md:order-1">
                    <div className="flex flex-wrap flex-row">
                        <div className="flex-shrink max-w-full xl:px-2 px-4 w-full sm:w-1/2 xl:w-1/4 mb-6">
                            <div className="bg-white rounded-lg shadow-lg h-full p-6">
                                <div className="flex flex-wrap flex-row items-center">
                                    <div className="max-w-full w-full">
                                        <h5 className="text-gray-500 mb-1">Total Members</h5>
                                        <h3 className="text-lg font-bold mb-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="inline-block mr-2 -mt-1 bi bi-eye" viewBox="0 0 640 512">
                                                <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z" />
                                            </svg>
                                            {dashboard?.members}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink max-w-full xl:px-2 px-4 w-full sm:w-1/2 xl:w-1/4 mb-6">
                            <div className="bg-white rounded-lg shadow-lg h-full p-6">
                                <div className="flex flex-wrap flex-row items-center">
                                    <div className="max-w-full w-full">
                                        <h5 className="text-gray-500 mb-1">Total Employees</h5>
                                        <h3 className="text-lg font-bold mb-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                width="16"
                                                height="16"
                                                className="inline-block mr-2 -mt-1 bi bi-hand-thumbs-up"
                                                viewBox="0 0 448 512">
                                                <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7H162.5c0 0 0 0 .1 0H168 280h5.5c0 0 0 0 .1 0H417.3c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2H224 204.3c-12.4 0-20.1 13.6-13.7 24.2z" />
                                            </svg>
                                            {dashboard?.employees}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink max-w-full xl:px-2 px-4 w-full sm:w-1/2 xl:w-1/4 mb-6">
                            <div className="bg-white rounded-lg shadow-lg h-full p-6">
                                <div className="flex flex-wrap flex-row items-center">
                                    <div className="max-w-full w-full">
                                        <h5 className="text-gray-500 mb-1">Total Freelancers</h5>
                                        <h3 className="text-lg font-bold mb-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                className="inline-block mr-2 -mt-1 bi bi-chat-left-text"
                                                height="16"
                                                fill="currentColor"
                                                viewBox="0 0 448 512">
                                                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                                            </svg>
                                            {dashboard?.freelancers}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
