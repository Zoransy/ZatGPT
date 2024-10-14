import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';  // 引入 Ant Design 组件
import { login } from "../../services/UserAuth.jsx";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';  // 可用于自定义样式，保持风格一致

const { Title, Text } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);  // 用于按钮加载状态
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        setLoading(true);
        const { username, password } = values;  // 从表单中获取用户名和密码
        try {
            const response = await login(username, password);
            message.success('Login successful!');
            navigate('/');
        } catch (err) {
            message.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);  // 无论成功或失败，都要停止加载状态
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <Title level={2}>Sign in to ZatGPT</Title>

                <Form
                    name="login"
                    layout="vertical"
                    onFinish={handleLogin}
                    className="login-form"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <Text type="secondary">
                    Don’t have an account? <a href="/register">Sign up</a>
                </Text>
            </div>
        </div>
    );
};

export default LoginPage;
