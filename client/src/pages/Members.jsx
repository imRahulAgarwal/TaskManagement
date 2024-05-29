import React, { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import Member from "../components/Member/Member";
import { userService } from "../api/user";
import MemberForm from "../components/MemberForm/MemberForm";

const Members = () => {
    const [members, setMembers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [showFormModal, setShowFormModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [memberId, setMemberId] = useState("");
    const [memberToEdit, setMemberToEdit] = useState({});

    const [role, setRole] = useState("");
    const [name, setName] = useState("");

    const getMembers = async () => {
        const result = await userService.listMembers(role, currentPage, name);
        if (result.users) {
            setMembers(result.users);
            setTotalPages(result.pages);
        } else {
            setMembers([]);
            setTotalPages(0);
        }
    };

    const prevPage = () => {
        if (currentPage - 1 > 0) setCurrentPage((prev) => prev - 1);
    };

    const nextPage = () => {
        if (currentPage + 1 >= totalPages) setCurrentPage((prev) => prev + 1);
    };

    const onEditBtnClick = (member) => {
        setMemberToEdit(member);
        setShowFormModal(true);
    };

    const handleResetBtnClick = (id) => {
        setMemberId(id);
        setConfirmModal(true);
    };

    const onDeleteBtnClick = async (id) => {
        const result = await userService.deleteMember(id);
        if (result) getMembers();
    };

    const handleYes = async () => {
        const result = await userService.resetPassword(memberId);
        handleNo();
    };

    const handleNo = () => {
        setConfirmModal(false);
        setMemberId("");
    };

    const handleCloseButton = () => {
        setMemberToEdit({});
        setShowFormModal(false);
    };

    const handleChange = () => {
        handleCloseButton();
        getMembers();
    };

    useEffect(() => {
        getMembers();
    }, [currentPage, role, name]);

    return (
        <>
            <div className="mx-auto py-2 sm:px-2">
                <div className="flex flex-wrap flex-row">
                    <div className="flex-shrink max-w-full px-4 w-full">
                        <p className="text-xl font-bold mt-3 mb-5">Members</p>
                    </div>
                    <div className="flex-shrink max-w-full px-4 w-full mb-6">
                        <div className="p-6 bg-white rounded-lg shadow-lg h-full">
                            <div className="flex -mx-4">
                                <div className="max-w-full px-4 w-full">
                                    <div className="flex md:flex-row flex-col justify-between items-center mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowFormModal(true)}
                                            className="py-2 px-4 max-md:w-full flex items-center rounded-sm text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0">
                                            Add new member
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="inline-block ml-1 bi bi-plus-lg" viewBox="0 0 16 16">
                                                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"></path>
                                            </svg>
                                        </button>
                                        <div className="flex lg:flex-row max-md:w-full flex-col gap-4 md:mt-0 mt-4">
                                            <select
                                                id="role"
                                                onChange={(e) => setRole(e.target.value)}
                                                value={role}
                                                name="role"
                                                required
                                                className="inline-block leading-5 relative py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0">
                                                <option value="">Select a role</option>
                                                <option value="Employee">Employee</option>
                                                <option value="Freelancer">Freelancer</option>
                                            </select>
                                            <div className="relative flex items-center w-full md:w-fit md:self-center">
                                                <svg
                                                    className="absolute left-0 z-20 w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 block"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20">
                                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                                </svg>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    title="Search by member name"
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:outline-none bg-gray-100 border border-gray-100 focus:border-gray-200 focus:ring-0"
                                                    placeholder="Search Member"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto no-scrollbar">
                                        <table className="w-full">
                                            <thead className="bg-gray-100 border-t border-l border-r">
                                                <tr>
                                                    <th className="px-4 py-3 border border-gray-200 whitespace-nowrap">Name</th>
                                                    <th className="px-4 py-3 border border-gray-200 whitespace-nowrap">Email</th>
                                                    <th className="px-4 py-3 border border-gray-200 whitespace-nowrap">Number</th>
                                                    <th className="px-4 py-3 border border-gray-200 whitespace-nowrap">Role</th>
                                                    <th className="px-4 py-3 border border-gray-200 whitespace-nowrap">Is Active</th>
                                                    <th className="px-4 py-3 border border-gray-200 whitespace-nowrap">Joined Date</th>
                                                    <th className="px-4 py-3 border border-gray-200 whitespace-nowrap">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {members.length ? (
                                                    members.map((member) => (
                                                        <Member
                                                            key={member._id}
                                                            data={member}
                                                            onResetBtnClick={() => handleResetBtnClick(member._id)}
                                                            onEditBtnClick={() => onEditBtnClick(member)}
                                                            onDeleteBtnClick={() => onDeleteBtnClick(member._id)}
                                                        />
                                                    ))
                                                ) : (
                                                    <tr></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {members.length ? (
                    <>
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
                            <p>Members not created.</p>
                        </div>
                    </div>
                )}
            </div>
            {showFormModal && <MemberForm onClose={handleCloseButton} member={memberToEdit} onChange={handleChange} />}
            {confirmModal && <ConfirmModal handleYes={handleYes} handleNo={handleNo} />}
        </>
    );
};

export default Members;
