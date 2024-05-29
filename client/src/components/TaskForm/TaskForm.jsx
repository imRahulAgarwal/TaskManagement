import React, { useEffect, useState } from "react";
import { userService } from "../../api/user";
import moment from "moment-timezone";

const TaskForm = ({ task = {}, taskId = "", closeModal, onChange }) => {
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDeadline, setTaskDeadline] = useState("");
    const [role, setRole] = useState("");
    const [taskAssignedTo, setTaskAssignedTo] = useState("");

    const [members, setMembers] = useState([]);

    const getMembers = async () => {
        if (role) {
            const result = await userService.listMembers(role);
            if (result.users) setMembers(result.users);
            else setMembers([]);
        } else setMembers([]);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        let result = null;
        if (taskId) {
            result = await userService.updateTask(taskId, taskName, taskDescription, taskDeadline, taskAssignedTo);
        } else {
            result = await userService.addTask(taskName, taskDescription, taskDeadline, taskAssignedTo);
        }

        if (result) onChange();
    };

    const emptyState = () => {
        setTaskName("");
        setTaskDescription("");
        setTaskDeadline("");
        setTaskAssignedTo("");
        setMembers([]);
    };

    useEffect(() => {
        getMembers();
    }, [role]);

    useEffect(() => {
        return () => emptyState();
    }, []);

    useEffect(() => {
        if (task?.name && taskId) {
            console.log(task);
            setTaskName(task.name);
            setTaskDescription(task.description);
            setRole(!task.isFreelancer ? "Employee" : "Freelancer");
            setTaskAssignedTo(task.assignedTo._id);
            setTaskDeadline(moment(task.deadline).tz("Asia/Kolkata").format("YYYY-MM-DD"));
        }
    }, [task, taskId]);

    return (
        <div className="z-50 w-full flex h-full absolute top-0 bottom-0 left-0 right-0">
            <div className="z-50 relative m-auto sm:w-2/3">
                <form className="bg-white rounded-lg shadow-lg border flex flex-col" onSubmit={handleUpdateSubmit}>
                    <div className="flex w-full justify-between items-center border-b">
                        <div className="px-6 py-3 text-xl font-bold">{taskId ? "Edit task" : "Add Task"}</div>
                        <button className="fill-current h-6 w-6 font-3xl mr-6 text-xl font-bold" type="button" onClick={closeModal}>
                            x
                        </button>
                    </div>

                    <div className="p-6 flex-grow">
                        <div className="flex flex-wrap flex-row">
                            <div className="mb-6 w-full flex md:flex-row flex-col">
                                <div className="flex-1 md:mr-2">
                                    <label className="inline-block mb-2" htmlFor="taskName">
                                        Task Name
                                    </label>
                                    <input
                                        type="text"
                                        name="taskName"
                                        id="taskName"
                                        value={taskName}
                                        onChange={(e) => setTaskName(e.target.value)}
                                        className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400"
                                        required
                                        title="Task Name"
                                    />
                                </div>

                                <div className="flex-1 md:ml-2">
                                    <label className="inline-block mb-2" htmlFor="taskDeadline">
                                        Task Deadline
                                    </label>
                                    <input
                                        type="date"
                                        name="taskDeadline"
                                        id="taskDeadline"
                                        value={taskDeadline}
                                        onChange={(e) => setTaskDeadline(e.target.value)}
                                        className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400"
                                        required
                                        title="Task Deadline"
                                    />
                                </div>
                            </div>

                            <div className="mb-6 w-full">
                                <label className="inline-block mb-2" htmlFor="taskDescription">
                                    Task Description
                                </label>
                                <textarea
                                    name="taskDescription"
                                    id="taskDescription"
                                    className="w-full resize-none overflow-y-auto leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400"
                                    required
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    rows={5}
                                    title="Task Description"></textarea>
                            </div>

                            <div className="mb-6 w-full flex md:flex-row flex-col">
                                <div className="flex-1 md:mr-2">
                                    <label className="inline-block mb-2" htmlFor="memberRole">
                                        Member Role
                                    </label>
                                    <select
                                        id="memberRole"
                                        onChange={(e) => setRole(e.target.value)}
                                        value={role}
                                        name="memberRole"
                                        required
                                        className="inline-block w-full leading-5 relative py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0">
                                        <option value="">Select a role</option>
                                        <option value="Employee">Employee</option>
                                        <option value="Freelancer">Freelancer</option>
                                    </select>
                                </div>

                                <div className="flex-1 md:ml-2">
                                    <label className="inline-block mb-2" htmlFor="taskAssignedTo">
                                        Task Assigned To
                                    </label>
                                    <select
                                        disabled={members.length ? false : true}
                                        id="taskAssignedTo"
                                        onChange={(e) => setTaskAssignedTo(e.target.value)}
                                        value={taskAssignedTo}
                                        name="taskAssignedTo"
                                        required
                                        className="inline-block w-full leading-5 relative py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0">
                                        <option value="">Select a member</option>
                                        {members.length &&
                                            members.map((member) => (
                                                <option value={member._id} key={member._id}>
                                                    {member.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-3 border-t flex justify-center">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="py-2 px-4 inline-block text-center rounded leading-5 text-gray-800 bg-gray-100 border border-gray-100 hover:text-gray-900 hover:bg-gray-200 hover:ring-0 hover:border-gray-200 focus:bg-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0 mr-2">
                            Close
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 inline-block text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0">
                            {taskId ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
        </div>
    );
};

export default TaskForm;
