import React, { useState } from "react";
import { userService } from "../api/user";
import { useDispatch } from "react-redux";
import { login } from "../store/auth/authSlice";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await userService.login(email, password);

        if (result) {
            dispatch(login(result));
        } else {
            setPassword("");
            setShowPassword(false);
        }
    };

    return (
        <div className="login-outer-div min-h-screen">
            <span className="black-overlay"></span>
            <div className="login-div sm:w-full md:w-2/3 xl:w-1/3 px-6 sm:px-12 min-h-screen">
                <div className="p-5 sm:p-8 my-auto">
                    <form onSubmit={handleSubmit}>
                        <h2 className="sm:text-2xl text-center font-semibold text-gray-800 px-4 max-h-9 overflow-hidden">Task Management By Rahul</h2>
                        <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700  border-gray-700" />
                        <div className="mb-6">
                            <label className="inline-block mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="on"
                                title="Email Address"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="inline-block mb-2">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="off"
                                title="Password"
                            />
                        </div>
                        <div className="mb-6 flex items-center">
                            <input
                                className="h-5 w-5 text-indigo-500 border border-gray-300 rounded focus:outline-none"
                                type="checkbox"
                                value={showPassword}
                                onChange={() => setShowPassword((prev) => !prev)}
                                name="show-password"
                                id="show-password"
                            />
                            <label className="ml-2" htmlFor="show-password">
                                Show Password
                            </label>
                        </div>
                        <div className="grid">
                            <button
                                type="submit"
                                className="py-2 px-4 inline-block text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0">
                                <i className="fas fa-sign-up mr-2"></i>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline-block w-4 h-4 mr-2 bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                    <path
                                        fillRule="evenodd"
                                        d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"></path>
                                    <path
                                        fillRule="evenodd"
                                        d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"></path>
                                </svg>
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
