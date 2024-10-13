import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';  // 引入 Ant Design 组件
import { register } from '../../services/userauth.jsx';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';  // 用于自定义样式

const { Title, Text } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);  // 控制按钮加载状态
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // 跳转

    const handleRegister = async (values) => {
        setLoading(true);
        const { username, password, email } = values;  // 从表单获取用户名、密码、邮箱
        try {
            const response = await register(username, password, email);
            message.success('Registration successful!');
            console.log(response);
            // 注册成功后，可以选择重定向到登录页
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <Title level={2}>Sign up for ZatGPT</Title>

                <Form
                    name="register"
                    layout="vertical"
                    onFinish={handleRegister}  // 表单提交逻辑
                    className="register-form"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}
                    >
                        <Input placeholder="Email" />
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
                            loading={loading}  // 注册中显示加载状态
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Text type="secondary">
                    Already have an account? <a href="/login">Sign in</a>
                </Text>
            </div>
        </div>
    );
};

export default RegisterPage;
