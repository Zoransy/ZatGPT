import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// 从环境变量获取 API URL
const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);  // 初始状态为 null，表示尚未确定身份状态

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');  // 从 localStorage 获取 token

            if (!token) {
                setIsAuthenticated(false);  // 如果没有 token，设置为未认证
                return;
            }

            try {
                // 发送请求到后端以验证 token 的有效性
                await axios.get(`${API_URL}/api/user-info/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setIsAuthenticated(true);  // 认证成功
            } catch (error) {
                setIsAuthenticated(false);  // 认证失败
            }
        };

        checkAuth();
    }, []);

    // 处理身份状态
    if (isAuthenticated === null) {
        // 尚未确定身份状态，展示加载中状态
        return <div>Loading...</div>;
    }

    if (isAuthenticated === false) {
        // 如果未登录，重定向到登录页面
        return <Navigate to="/login" replace />;
    }

    // 如果已登录，展示目标页面
    return children;
};

export default ProtectedRoute;
