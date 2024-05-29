import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider, useSelector } from "react-redux";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import store from "./store/store.js";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Members from "./pages/Members.jsx";
import Profile from "./pages/Profile.jsx";
import Task from "./pages/Task.jsx";

const Routing = () => {
    const { user } = useSelector((state) => state.auth);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<App />}>
                <Route path="" element={!user ? <Login /> : user.role === "Admin" ? <Dashboard /> : <Navigate to="/tasks" replace />} />
                <Route path="profile" element={!user ? <Navigate to="/" replace /> : <Profile />} />
                <Route path="tasks" element={user ? <Tasks /> : <Navigate to="/" replace />} />
                <Route path="task/:taskId" element={user ? <Task /> : <Navigate to="/" replace />} />
                <Route path="members" element={!user ? <Navigate to="/" replace /> : user.role === "Admin" ? <Members /> : <Navigate to="/tasks" replace />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <Routing />
        <ToastContainer />
    </Provider>
);
