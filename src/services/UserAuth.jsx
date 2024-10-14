import apiClient from "../api/apiClient.jsx";

// 登录服务：发送用户名和密码到后端，获取并保存 JWT Token
export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/api/token/', {
            username,
            password,
        });

        const { access, refresh } = response.data;
        // 保存 access 和 refresh token
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        return response.data;
    } catch (error) {
        throw error;
    }
};

// 注册服务：发送用户名、密码等信息到后端
export const register = async (username, password, email) => {
    try {
        const response = await apiClient.post('/api/register/', {
            username,
            password,
            email,
        });

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// 获取用户信息
export const getUserInfo = async () => {
    try {
        const response = await apiClient.get('/api/user-info/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 刷新 access token：使用 refresh token 来刷新
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        throw new Error("No refresh token found, user might not be authenticated");
    }

    try {
        const response = await apiClient.post('/api/token/refresh/', {
            refresh: refreshToken,
        });

        const { access, refresh } = response.data;  // 获取新的 access 和 refresh token

        // 更新 access 和 refresh token
        localStorage.setItem('access_token', access);
        if (refresh) {
            localStorage.setItem('refresh_token', refresh);
        }

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
