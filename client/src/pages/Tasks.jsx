import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TaskCard from "../components/TaskCard/TaskCard";
import TaskForm from "../components/TaskForm/TaskForm";
import { userService } from "../api/user";

const Tasks = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [role, setRole] = useState("");

    const { user } = useSelector((state) => state.auth);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const prevPage = () => {
        if (currentPage - 1 > 0) setCurrentPage((prev) => prev - 1);
    };

    const nextPage = () => {
        if (currentPage + 1 >= totalPages) setCurrentPage((prev) => prev + 1);
    };

    const getTasks = async () => {
        const result = await userService.listTasks(currentPage, search, role);
        if (result) {
            setTasks(result.tasks);
            setTotalPages(result.pages);
        }
    };

    const handleChange = () => {
        setAddTaskModal(false);
        getTasks();
        setCurrentPage(1);
        setSearch("");
    };

    useEffect(() => {
        getTasks();
    }, [currentPage, search, role]);

    return (
        <>
            <div className="mx-auto py-2 sm:px-2">
                <div className="flex flex-wrap flex-row">
                    <div className="flex-shrink max-w-full px-4 w-full">
                        <p className="text-xl font-bold mt-3 mb-5">Tasks</p>
                    </div>
                    <div className="flex-shrink max-w-full px-4 w-full mb-6">
                        <div className="py-4 px-6 bg-white rounded-lg shadow-lg h-full">
                            <div className="flex flex-wrap flex-row">
                                <div className="flex-shrink max-w-full w-full">
                                    <div className="md:flex items-center">
                                        {user.role === "Admin" && (
                                            <span
                                                onClick={() => setAddTaskModal(true)}
                                                className="cursor-pointer flex items-center py-2 px-4 text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0">
                                                <span>Assign new task</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="inline-block ml-1 bi bi-plus-lg" viewBox="0 0 16 16">
                                                    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"></path>
                                                </svg>
                                            </span>
                                        )}
                                        <div className="ml-auto flex lg:flex-row flex-col gap-y-3 md:mt-0 mt-4">
                                            {user.role === "Admin" && (
                                                <div className="flex items-center lg:mr-4">
                                                    <select
                                                        id="role"
                                                        onChange={(e) => setRole(e.target.value)}
                                                        value={role}
                                                        name="role"
                                                        required
                                                        className="inline-block w-full leading-5 relative py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0">
                                                        <option value="">Select a role</option>
                                                        <option value="Employee">Employee</option>
                                                        <option value="Freelancer">Freelancer</option>
                                                    </select>
                                                </div>
                                            )}
                                            <div className="relative flex items-center w-full md:w-60  md:self-center">
                                                <svg
                                                    className="absolute left-0 z-20 w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 block"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20">
                                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                                </svg>
                                                <input
                                                    type="text"
                                                    value={search}
                                                    title="Search by task name"
                                                    onChange={handleSearch}
                                                    className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:outline-none bg-gray-100 border border-gray-100 focus:border-gray-200 focus:ring-0"
                                                    placeholder="Search task"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {tasks.length ? (
                    <>
                        <div className="flex flex-wrap flex-row gap-y-4">{tasks.length && tasks.map((task) => <TaskCard task={task} key={task?._id} />)}</div>

                        <div className="flex justify-center items-center p-4">
                            <ul className="flex gap-x-2 space-x-0">
                                <li>
                                    <button
                                        disabled={currentPage > 1 && currentPage <= totalPages ? false : true}
                                        onClick={prevPage}
                                        className="rounded block relative py-2 disabled:opacity-40 disabled:bg-white disabled:text-black px-4 bg-white border border-gray-200 hover:text-gray-100 hover:bg-indigo-600 -mr-0.5 rounded-r"
                                        aria-label="Next">
                                        <span>«</span>
                                    </button>
                                </li>

                                <li>
                                    <a className="rounded block relative py-2 px-4 border border-gray-200 hover:text-gray-100 hover:bg-indigo-600 -mr-0.5 bg-indigo-500 text-gray-100" href="#">
                                        {currentPage} of {totalPages}
                                    </a>
                                </li>
                                <li>
                                    <button
                                        disabled={currentPage < totalPages ? false : true}
                                        onClick={nextPage}
                                        className="rounded block relative py-2 px-4 bg-white disabled:opacity-40 disabled:bg-white disabled:text-black border border-gray-200 hover:text-gray-100 hover:bg-indigo-600 -mr-0.5 rounded-r"
                                        aria-label="Next">
                                        <span>»</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="w-full text-center px-4 max-w-full">
                        <div className="bg-white rounded-lg shadow-lg py-2">
                            <p>Tasks not found.</p>
                        </div>
                    </div>
                )}
            </div>
            {addTaskModal && <TaskForm closeModal={() => setAddTaskModal(false)} onChange={handleChange} />}
        </>
    );
};

export default Tasks;
