import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo } from "../services/UserAuth.jsx"; // 引入封装好的方法

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);  // 初始状态为 null，表示尚未确定身份状态

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 使用封装好的 getUserInfo 方法
                await getUserInfo();
                setIsAuthenticated(true);  // 用户信息获取成功，设置为已认证
            } catch (error) {
                setIsAuthenticated(false);  // 获取用户信息失败，设置为未认证
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
