import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import { userService } from "./api/user";
import { login, logout } from "./store/auth/authSlice";
import Loader from "./components/Loader/Loader";

const App = () => {
    const [loader, setLoader] = useState(true);
    const { status } = useSelector((state) => state.auth);
    const [showSidebar, setShowSidebar] = useState(window.innerWidth <= 768 ? false : true);

    const dispatch = useDispatch();

    const handleScreenResize = () => {
        if (window.innerWidth <= 768) setShowSidebar(false);
        else setShowSidebar(true);
    };

    useEffect(() => {
        window.addEventListener("resize", handleScreenResize);
    }, []);

    const getStatus = async () => {
        const result = await userService.profile();
        if (result) dispatch(login(result));
        else dispatch(logout());
        setTimeout(() => setLoader(false), 2000);
    };

    useEffect(() => {
        getStatus();
    }, []);

    useEffect(() => {
        setLoader(true);
        setTimeout(() => setLoader(false), [2000]);
    }, [status]);

    if (loader) return <Loader />;

    return (
        <div className="main">
            {status && <Sidebar show={showSidebar} />}
            <div className={`flex flex-col min-h-screen transition-all duration-500 ease-in-out ${showSidebar && status ? "ms-64 -me-64 md:ms-64 md:me-0" : "me-0 ms-0"}`}>
                {status && <Navbar onClick={() => setShowSidebar((prev) => !prev)} show={showSidebar} />}
                <main className={status ? "pt-20 -mt-2" : ""}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default App;
