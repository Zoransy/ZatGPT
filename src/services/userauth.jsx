import axios from 'axios';

// 从 Vite 环境变量中获取后端 API 的 URL
const API_URL = import.meta.env.VITE_API_URL;

// 登录服务：发送用户名和密码到 Django 后端，获取并保存 JWT Token
export const login = async (username, password) => {
    try {
        // 发送 POST 请求到 Django 的登录视图
        const response = await axios.post(`${API_URL}/api/token/`, {
            username: username,
            password: password,
        });

        const { access, refresh } = response.data;  // 获取 access 和 refresh token

        // 将 token 保存到 localStorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        return response.data;
    } catch (error) {
        throw error;
    }
};

// 注册服务：发送用户名、密码等信息到 Django 后端
export const register = async (username, password, email) => {
    try {
        // 发送 POST 请求到 Django 的注册视图
        const response = await axios.post(`${API_URL}/api/register/`, {
            username: username,
            password: password,
            email: email,
        });

        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

// 获取用户信息服务：需要携带 JWT Token
export const getUserInfo = async () => {
    const accessToken = await refreshAccessToken();  // 从 localStorage 获取 access token

    if (!accessToken) {
        throw new Error("No access token found, user might not be authenticated");
    }

    try {
        // 发送请求到后端，携带 Bearer Token
        const response = await axios.get(`${API_URL}/api/user-info/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,  // 携带 JWT Token
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// 刷新 access token：使用 refresh token 刷新
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        throw new Error("No refresh token found, user might not be authenticated");
    }

    try {
        const response = await axios.post(`${API_URL}/api/token/refresh/`, {
            refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);  // 更新 access token

        return access;
    } catch (error) {
        throw error;
    }
};

// 登出服务：清除存储的 JWT Token
export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};
