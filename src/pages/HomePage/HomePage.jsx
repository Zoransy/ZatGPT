import React, { useEffect, useState } from 'react';
import {getUserInfo} from "../../services/userauth.jsx";  // 假设 auth.js 文件中包含 getUserInfo 函数
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // 用于重定向用户到其他页面

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUserInfo(data);  // 保存获取到的用户信息
            } catch (error) {
                setError("Failed to fetch user information. Please login again.");
                navigate('/login');  // 如果获取失败，重定向到登录页面
            }
        };

        fetchUserInfo();
    }, [navigate]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>Loading user info...</div>;
    }

    return (
        <div>
            <h1>Welcome to HomePage</h1>
            <h2>User Info</h2>
            <p><strong>Username:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
        </div>
    );
};

export default HomePage;
