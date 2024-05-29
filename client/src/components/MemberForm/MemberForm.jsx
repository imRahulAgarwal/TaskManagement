import React, { useEffect, useState } from "react";
import { userService } from "../../api/user";

const MemberForm = ({ member, onClose, onChange }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [role, setRole] = useState("");
    const [isActive, setIsActive] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result = null;

        if (member?.name) result = await userService.updateMember(member._id, name, email, number, role, isActive);
        else result = await userService.createMember(name, email, number, role);

        if (result) onChange();
    };

    useEffect(() => {
        if (member?.name) {
            setName(member.name);
            setEmail(member.email);
            setRole(member.role);
            setNumber(member.number);
            setIsActive(member.isActive);
        }
    }, [member]);

    return (
        <div className="z-50 w-full h-full flex left-0 top-0 bottom-0 right-0 absolute">
            <div className="z-50 md:w-1/2 sm:w-3/4 w-11/12 m-auto relative">
                <div className="bg-white rounded shadow-lg">
                    <button className="h-6 w-6 absolute right-0 top-0 m-2 text-xl font-bold" onClick={onClose}>
                        x
                    </button>
                    <div className="px-6 py-3 text-xl border-b font-bold text-center">Add New Member</div>
                    <form className="flex flex-wrap flex-col my-2" onSubmit={handleSubmit}>
                        <div className="flex md:flex-row flex-col mb-4 px-4 gap-4">
                            <div className="md:flex-1">
                                <label htmlFor="name" className="inline-block mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full py-1 px-4 rounded text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-gray-400"
                                    id="name"
                                    name="name"
                                    required
                                />
                            </div>
                            <div className="md:flex-1">
                                <label htmlFor="email" className="inline-block mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-1 px-4 rounded text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-gray-400"
                                    id="email"
                                    name="email"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col mb-4 px-4 gap-4">
                            <div className="md:flex-1">
                                <label htmlFor="number" className="inline-block mb-2">
                                    Number
                                </label>
                                <input
                                    value={number}
                                    type="text"
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="w-full py-1 px-4 rounded text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-gray-400"
                                    id="number"
                                    name="number"
                                    required
                                />
                            </div>
                            <div className="md:flex-1">
                                <label htmlFor="role" className="inline-block mb-2">
                                    Role
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    id="role"
                                    name="role"
                                    required
                                    className="w-full py-1 px-4 rounded text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-gray-400">
                                    <option value="">Select Option</option>
                                    <option value="Employee">Employee</option>
                                    <option value="Freelancer">Freelancer</option>
                                </select>
                            </div>
                        </div>

                        {member?.name && (
                            <div className="mb-4 px-4 gap-4">
                                <label htmlFor="isActive" className="inline-block mb-2">
                                    Active Status
                                </label>
                                <select
                                    value={isActive}
                                    onChange={(e) => setIsActive(e.target.value)}
                                    id="isActive"
                                    name="isActive"
                                    required
                                    className="w-full py-1 px-4 rounded text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-gray-400">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        )}

                        <div className="p-4 border-t flex justify-center">
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-2 px-4 inline-block text-center rounded leading-5 text-gray-800 bg-gray-200 border border-gray-200 hover:bg-gray-300 hover:ring-0 hover:border-gray-300 mr-2">
                                Close
                            </button>
                            <button
                                type="submit"
                                className="py-2 px-4 inline-block text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600">
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
        </div>
    );
};

export default MemberForm;
