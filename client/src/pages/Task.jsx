import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../api/user";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import TaskForm from "../components/TaskForm/TaskForm";

const Task = () => {
    const { user } = useSelector((state) => state.auth);
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [loader, setLoader] = useState(true);
    const [task, setTask] = useState({});

    // Employee or Freelancer Update Model and other states
    const [updateModal, setUpdateModal] = useState(false);
    const [completedPercentage, setCompletedPercentage] = useState("");
    const [file, setFile] = useState("");

    // Admin update and delete model state
    const [updateAdminModal, setUpdateAdminModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const getTask = async () => {
        const result = await userService.listTask(taskId);
        if (result) setTask(result);
        else navigate("/tasks");
        setLoader(false);
    };

    // Function to handle confirm modal action
    const handleYes = async () => {
        const result = await userService.deleteTask(taskId);
        if (result) navigate("/tasks");
        setShowDeleteModal(false);
    };

    // Function to handle confirm modal action
    const handleNo = async () => {
        setShowDeleteModal(false);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("completedPercentage", completedPercentage);
        formData.append("invoice", file);

        const result = await userService.updateTaskData(taskId, formData);
        if (result) getTask();

        setFile("");
        setUpdateModal(false);
        setCompletedPercentage("");
    };

    const handleChange = () => {
        setUpdateAdminModal(false);
        getTask();
    };

    useEffect(() => {
        getTask();
    }, []);

    if (loader) return <></>;

    return (
        <>
            <div className="mx-auto py-2 sm:px-2 relative">
                <div className="flex flex-wrap flex-row">
                    <div className="flex-shrink max-w-full px-4 w-full">
                        <p className="text-xl font-bold mt-3 mb-5">Task</p>
                    </div>
                    <div className="flex-shrink max-w-full px-4 w-full mb-6">
                        <div className="flex flex-wrap flex-row">
                            <div className="flex-shrink max-w-full lg:pr-2 w-full lg:w-1/3 max-lg:mb-6">
                                <div className="bg-white rounded-lg shadow-lg h-full p-6">
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <h3 className="text-base font-bold">Task Information</h3>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="border-t border-gray-200 my-3"></div>
                                        <div className="text-left">
                                            <p className="mb-2">
                                                <strong>Task Name :</strong>
                                                <span className="ml-2">{task?.name}</span>
                                            </p>
                                            <p className="mb-2">
                                                <strong>Assigned To :</strong>
                                                <span className="ml-2">{task?.assignedTo.name}</span>
                                            </p>
                                            <p className="mb-2">
                                                <strong>Role :</strong>
                                                <span className="ml-2">{task?.isFreelancer ? "Freelancer" : "Employee"}</span>
                                            </p>
                                            <div className="mb-2">
                                                <strong>Date Assigned :</strong>
                                                <span className="ml-2">{moment(task.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY")}</span>
                                            </div>
                                            <p className="mb-2">
                                                <strong>Deadline :</strong>
                                                <span className="ml-2">{moment(task.deadline).tz("Asia/Kolkata").format("DD-MM-YYYY")}</span>
                                            </p>
                                            <div className="mb-2">
                                                <strong>Days Remaining :</strong>
                                                <span className="text-base font-bold text-red-600 ml-2">{moment(task.deadline).diff(new Date(), "days")} Days</span>
                                            </div>
                                            <p className="mb-2">
                                                <strong>Completed :</strong>
                                                <span className="ml-2 font-semibold">
                                                    {task.completedPercentage === 100 ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}
                                                </span>
                                            </p>
                                            {task.completedPercentage === 100 && (
                                                <p className="mb-2">
                                                    <strong>Completed Date :</strong>
                                                    <span className="ml-2">{moment(task.completedDateTime).tz("Asia/Kolkata").format("DD-MM-YYYY")}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink max-w-full lg:pl-2 w-full lg:w-2/3">
                                <div className="bg-white rounded-lg shadow-lg h-full p-6">
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <h3 className="text-base font-bold">Task Description</h3>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="border-t border-gray-200 my-3"></div>
                                        <div className="text-left">
                                            <p className="mb-2">{task?.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row p-4 justify-center">
                    {user.role !== "Admin" && task.completedPercentage !== 100 && (
                        <button
                            onClick={() => setUpdateModal(true)}
                            className="bg-gray-300 px-4 py-2 focus:ring-0 focus:bg-gray-300 hover:bg-gray-400 rounded-sm duration-200 ease-in-out transition-all text-black focus:outline-none">
                            Update Task Status
                        </button>
                    )}
                    {user.role === "Admin" && (
                        <>
                            <button
                                onClick={() => setUpdateAdminModal(true)}
                                className="mr-2 bg-gray-300 px-4 py-2 focus:ring-0 focus:bg-gray-300 hover:bg-gray-400 rounded-sm duration-200 ease-in-out transition-all text-black focus:outline-none">
                                Update Task
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-500 px-4 py-2 focus:ring-0 focus:bg-red-500 hover:bg-red-600 rounded-sm duration-200 ease-in-out transition-all text-white focus:outline-none">
                                Delete Task
                            </button>
                        </>
                    )}
                </div>
            </div>
            {updateModal && (
                <div className="z-50 w-full flex h-full absolute top-0 bottom-0 left-0 right-0">
                    <div className="z-50 relative m-auto lg:w-1/3 md:w-3/6 sm:w-2/3">
                        <form className="bg-white rounded-lg shadow-lg border flex flex-col" onSubmit={handleUpdateSubmit}>
                            <div className="flex w-full justify-between items-center border-b">
                                <div className="px-6 py-3 text-xl font-bold">Edit task status</div>
                                <button className="fill-current h-6 w-6 font-3xl mr-6 text-xl font-bold" onClick={() => setUpdateModal(false)}>
                                    x
                                </button>
                            </div>
                            <div className="p-6 flex-grow">
                                <div className="flex flex-wrap flex-row -mx-4">
                                    <div className="form-group max-w-full px-4 w-full mb-6">
                                        <label htmlFor="completedPercentage" className="inline-block mb-2">
                                            Completed Percentage
                                        </label>
                                        <select
                                            id="completedPercentage"
                                            onChange={(e) => setCompletedPercentage(e.target.value)}
                                            value={completedPercentage}
                                            name="completedPercentage"
                                            required
                                            className="inline-block w-full leading-5 relative py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0">
                                            <option selected value="">
                                                Select Completed Percentage
                                            </option>
                                            <option value="50">50 %</option>
                                            <option value="100">100 %</option>
                                        </select>
                                        <p className="text-red-600 text-sm">Note : Cannot update once marked as 100 %.</p>
                                    </div>

                                    {task.isFreelancer && (
                                        <div className="form-group max-w-full px-4 w-full mb-6">
                                            <label htmlFor="invoice" className="inline-block mb-2">
                                                Freelancer Invoice
                                            </label>
                                            <input
                                                className="inline-block w-full leading-5 relative py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0"
                                                type="file"
                                                value={file}
                                                onChange={(e) => setFile(e.target.files[0])}
                                                name="invoice"
                                                id="invoice"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-3 border-t flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setUpdateModal(false)}
                                    className="py-2 px-4 inline-block text-center rounded leading-5 text-gray-800 bg-gray-100 border border-gray-100 hover:text-gray-900 hover:bg-gray-200 hover:ring-0 hover:border-gray-200 focus:bg-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0 mr-2">
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="py-2 px-4 inline-block text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
                </div>
            )}

            {updateAdminModal && <TaskForm closeModal={() => setUpdateAdminModal(false)} taskId={taskId} task={task} onChange={handleChange} />}
            {showDeleteModal && <ConfirmModal handleNo={handleNo} handleYes={handleYes} />}
        </>
    );
};

export default Task;
