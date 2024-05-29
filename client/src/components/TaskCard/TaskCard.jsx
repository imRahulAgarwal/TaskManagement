import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const TaskCard = ({ task }) => {
    return (
        <div className="flex-shrink max-w-full w-full lg:w-1/2 px-4">
            <Link className="w-full" to={`/task/${task._id}`}>
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                    <div className="pb-4">
                        <h3 className="text-base font-bold">{task.name}</h3>
                    </div>

                    <div className="flex flex-col pb-4">
                        <div className="flex flex-row items-center">
                            <p className="text-sm text-gray-500">{task.description.substring(0, 99)}...</p>
                        </div>
                    </div>

                    <div className="flex sm:flex-row flex-col justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm inline-block text-gray-500">
                                Task Assigned Date : <span className="text-gray-700 font-bold">{moment(task.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY")}</span>
                            </span>
                        </div>

                        <div className="flex flex-col pb-4">
                            <span className="text-sm inline-block text-gray-500">
                                Task Deadline : <span className="text-red-500 font-bold">{moment(task.deadline).tz("Asia/Kolkata").format("DD-MM-YYYY")}</span>
                            </span>
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <span className="px-2 py-1 flex items-center font-semibold text-sm rounded text-blue-800 border border-blue-400  bg-white">Task Assigned To : {task.assignedTo.name}</span>
                    </div>

                    <div className="w-full h-5 bg-gray-200 rounded-full mt-2">
                        <div className="h-full flex justify-center items-center bg-yellow-500 rounded-full" style={{ width: `${task.completedPercentage}%` }}>
                            {task.completedPercentage ? <span className="text-xs text-white">{task.completedPercentage}%</span> : ""}
                        </div>
                    </div>
                    {task.completedPercentage === 100 && (
                        <div className="flex justify-between mt-3">
                            <div>
                                <span className="text-sm inline-block text-gray-500">
                                    Task Completed Date : <span className="text-gray-700 font-bold">{moment(task.completedDateTime).tz("Asia/Kolkata").format("DD-MM-YYYY")}</span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default React.memo(TaskCard);
