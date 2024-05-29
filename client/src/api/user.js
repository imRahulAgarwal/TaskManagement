import { toast } from "react-toastify";
import { apiUrl, toastOptions } from "../conf/conf";

class UserService {
    headers = { "Content-Type": "application/json" };
    async login(email, password) {
        const response = await fetch(`${apiUrl}/user/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: this.headers,
        });

        const { success, message, token, user } = await response.json();
        if (success) {
            localStorage.setItem("token", token);
            toast.success(message, toastOptions);
            return user;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async profile() {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/profile`, {
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message, user } = await response.json();
        if (success) return user;
        return false;
    }

    async changePassword(oldPassword, newPassword, confirmPassword) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/change-password`, {
            method: "POST",
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async listTasks(page, name, role) {
        let url = `${apiUrl}/user/tasks?`;
        if (page) url += `page=${page}&`;

        if (name) url += `name=${name}&`;

        if (role === "Employee") url += `role=0`;
        else if (role === "Freelancer") url += `role=1`;

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message, tasks, pages } = await response.json();
        if (success) return { tasks, pages };
        else return { tasks: [], pages: 0 };
    }

    async listTask(taskId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/tasks/${taskId}`, {
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message, task } = await response.json();
        if (success) return task;
        else toast.error(message, toastOptions);
        return false;
    }

    async updateTaskData(taskId, formData) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/tasks/${taskId}`, {
            method: "PATCH",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async listMembers(role, page, name) {
        const token = localStorage.getItem("token");

        let url = `${apiUrl}/user/members?`;

        if (role === "Employee") url += `freelancer=0&`;
        else if (role === "Freelancer") url += "freelancer=1&";

        if (page) url += `page=${page}&`;
        if (name) url += `name=${name}&`;

        const response = await fetch(url, {
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message, users, pages } = await response.json();
        if (success) return { users, pages };
        else return false;
    }

    async createMember(name, email, number, role) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/members`, {
            method: "POST",
            body: JSON.stringify({ name, email, number, role }),
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);
        return success;
    }

    async updateMember(memberId, name, email, number, role, isActive) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/members/${memberId}`, {
            method: "PUT",
            body: JSON.stringify({ name, email, number, role, isActive }),
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);
        return success;
    }

    async deleteMember(memberId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/members/${memberId}`, {
            method: "DELETE",
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);
        return success;
    }

    async addTask(name, description, deadline, assignedTo) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/tasks`, {
            method: "POST",
            body: JSON.stringify({ name, description, deadline, assignedTo }),
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async updateTask(taskId, name, description, deadline, assignedTo) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/tasks/${taskId}`, {
            method: "PUT",
            body: JSON.stringify({ name, description, deadline, assignedTo }),
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async deleteTask(taskId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/tasks/${taskId}`, {
            method: "DELETE",
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }

    async getDashboardInfo() {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/dashboard`, {
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message, dashboardData } = await response.json();

        if (success) return dashboardData;
        else toast.error(message, toastOptions);

        return false;
    }

    async resetPassword(userId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/user/reset-password`, {
            method: "POST",
            body: JSON.stringify({ userId }),
            headers: { ...this.headers, Authorization: `Bearer ${token}` },
        });

        const { success, message } = await response.json();
        if (success) toast.success(message, toastOptions);
        else toast.error(message, toastOptions);

        return success;
    }
}

export const userService = new UserService();
