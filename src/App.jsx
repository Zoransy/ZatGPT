import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import ChatPage from './pages/HomePage/ChatPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';  // 导入受保护的路由组件

function App() {
    return (
        <Router>
            <Routes>
                {/* 受保护的主页路由 */}
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    }
                />
                {/* 登录和注册页面 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Router>
    );
}

export default App;
