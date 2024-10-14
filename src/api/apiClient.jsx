import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 从 Vite 环境变量中获取后端 API 的 URL
const API_URL = import.meta.env.VITE_API_URL;

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        // 获取存储在 localStorage 中的 access_token
        const accessToken = localStorage.getItem('access_token');

        config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加拦截器处理 401 错误
apiClient.interceptors.response.use(
    (response) => response,  // 正常响应直接返回
    async (error) => {
        const navigate = useNavigate();  // 用于页面跳转

        if (error.response && error.response.status === 401) {
            logout();
            navigate('/login');  // 跳转到登录页面
        }
        return Promise.reject(error);
    }
);

export default apiClient;  // 导出全局可用的 apiClient 实例
