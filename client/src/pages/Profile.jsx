import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import { userService } from "../api/user";
import { logout } from "../store/auth/authSlice";

const Profile = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const emptyState = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const result = await userService.changePassword(oldPassword, newPassword, confirmPassword);
        if (result) {
            localStorage.removeItem("token");
            dispatch(logout());
        } else emptyState();
    };

    useEffect(() => {
        return () => emptyState();
    }, []);

    return (
        <div className="mx-auto py-2 sm:px-2">
            <div className="flex flex-wrap flex-row">
                <div className="flex-shrink max-w-full px-4 w-full">
                    <p className="text-xl font-bold mt-3 mb-5">Profile</p>
                </div>
                <div className="flex-shrink max-w-full px-4 w-full mb-6">
                    <div className="flex flex-wrap flex-row">
                        <div className="flex-shrink max-w-full lg:pr-2 w-full lg:w-1/3 max-lg:mb-6">
                            <div className="bg-white flex flex-col justify-center rounded-lg shadow-lg h-full p-6">
                                <div className="flex justify-center relative">
                                    {user?.image ? (
                                        <img src={user?.image} className="rounded-full w-24 h-24 bg-gray-200 border-solid border-white border-2" />
                                    ) : (
                                        <div className="rounded-full w-24 h-24 bg-gray-200 border-solid border-white border-2" />
                                    )}
                                </div>
                                <div className="text-center pt-3">
                                    <h3 className="text-gray-800 font-bold text-lg">{user?.name}</h3>
                                    <p className="font-light">{user?.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink max-w-full lg:pl-2 w-full lg:w-2/3">
                            <div className="bg-white rounded-lg shadow-lg h-full p-6">
                                <div className="flex flex-row justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="text-base font-bold">Information</h3>
                                    </div>
                                </div>
                                <div>
                                    <div className="border-t border-gray-200 my-3"></div>
                                    <div className="text-left">
                                        <p className="mb-2">
                                            <strong>Full Name :</strong>
                                            <span className="ml-2">{user?.name}</span>
                                        </p>
                                        <p className="mb-2">
                                            <strong>Mobile :</strong>
                                            <span className="ml-2">(+91) {user?.number}</span>
                                        </p>
                                        <p className="mb-2">
                                            <strong>Email :</strong>
                                            <span className="ml-2">{user?.email}</span>
                                        </p>
                                        <p className="mb-2">
                                            <strong>Role :</strong>
                                            <span className="ml-2">{user?.role}</span>
                                        </p>
                                        <p className="mb-2">
                                            <strong>Join Date :</strong>
                                            <span className="ml-2">{moment(user?.createdAt).tz("Asia/Kolkata").format("DD-MM-YYYY")}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink max-w-full px-4 w-full mb-6">
                    <div className="flex flex-wrap flex-row">
                        <div className="flex-shrink max-w-full w-full">
                            <div className="bg-white rounded-lg shadow-lg h-full p-6">
                                <div className="flex flex-row justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="text-base font-bold">Change Password</h3>
                                    </div>
                                </div>
                                <div>
                                    <div className="border-t border-gray-200 my-3"></div>
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="mb-4">
                                            <label className="inline-block mb-2" htmlFor="oldPassword">
                                                Old Password
                                            </label>
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                id="oldPassword"
                                                className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                required
                                                title="Old Password"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="inline-block mb-2" htmlFor="newPassword">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                id="newPassword"
                                                className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                title="New Password"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="inline-block mb-2" htmlFor="confirmPassword">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                title="Confirm Password"
                                            />
                                        </div>
                                        <div className="flex">
                                            <button className="mx-auto rounded-sm bg-green-500 hover:bg-green-600 text-white duration-200 ease-in-out transition-all py-2 w-1/3">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
