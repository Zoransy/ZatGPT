import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './ChatPage.css';
import {getUserInfo} from "../../services/UserAuth.jsx";

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;

const ChatPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [sessions, setSessions] = useState([]);  // 会话列表
    const [currentSessionId, setCurrentSessionId] = useState(null);  // 当前会话ID
    const [messages, setMessages] = useState([]);  // 当前会话的消息
    const [inputMessage, setInputMessage] = useState('');  // 输入框中的消息
    const [hasSentMessage, setHasSentMessage] = useState(false);  // 是否已经发送消息
    const [username, setUsername] = useState('');  // 当前用户名
    const chatContainerRef = useRef(null);

    // 初始化加载会话列表
    useEffect(() => {
        loadSessions();
        loadUserInfo();  // 加载用户信息
    }, []);

    // 加载用户信息
    const loadUserInfo = async () => {
        try {
            const userInfo = await getUserInfo();  // 获取用户信息
            setUsername(userInfo.username);  // 假设userInfo中包含username字段
        } catch (error) {
            console.error('Failed to load user info', error);
        }
    };

    // 加载会话列表
    const loadSessions = async () => {
        const mockSessions = [{ id: 1, title: 'Chat 1' }, { id: 2, title: 'Chat 2' }];
        setSessions(mockSessions);
    };

    // 切换会话
    const handleSessionClick = (sessionId) => {
        setCurrentSessionId(sessionId);
        loadMessages(sessionId);  // 加载选中的会话消息
        setHasSentMessage(false);  // 重置消息发送状态
    };

    // 加载当前会话的消息
    const loadMessages = async (sessionId) => {
        const mockMessages = [
            { id: 1, role: 'user', content: 'Hello!' },
            { id: 2, role: 'assistant', content: 'Hi there!' },
        ];
        setMessages(mockMessages);
    };

    // 发送消息
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage = { role: 'user', content: inputMessage };
        const assistantReply = { role: 'assistant', content: 'Got it!' };

        // 在一次 setMessages 调用中同时更新用户消息和助手的回复
        setMessages((prevMessages) => [...prevMessages, newMessage, assistantReply]);

        setInputMessage('');  // 清空输入框
        setHasSentMessage(true);  // 设置已发送消息状态
    };

    // 登出
    const handleLogout = () => {
        localStorage.removeItem('access_token');  // 清除token
        window.location.href = '/login';  // 跳转到登录页面
    };

    // 滚动到聊天底部
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Layout style={{ height: '100vh' }}>
            {/* 左侧边栏 */}
            <Sider width={260}>
                <div className="new-chat-button">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        block
                        onClick={() => {
                            console.log('New Chat');
                            setHasSentMessage(false);  // 新建会话时，重置消息发送状态
                            setMessages([]);  // 清空消息
                        }}
                    >
                        New Chat
                    </Button>
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={[currentSessionId]} style={{ fontSize: '15px' }}>
                    {sessions.map((session) => (
                        <Menu.Item key={session.id} onClick={() => handleSessionClick(session.id)}>
                            {session.title}
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>

            {/* 主体内容 */}
            <Layout>
                <Header className="chat-header">
                    <div className="chat-title">
                        ChatGPT 3.5-Turbo
                    </div>
                    {/* 右侧展示用户名和登出按钮 */}
                    <div className="user-info">
                        <span style={{ marginRight: '10px' }}>Hello, {username}</span>
                        <Button type="link" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </Header>
                <Content className="chat-content">
                    <div ref={chatContainerRef} className="chat-messages">
                        {!hasSentMessage ? (
                            <div className="welcome-message">
                                <h1>Welcome to ZatGPT!</h1>
                                <h3>How can I help you today? </h3>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div key={index} className={message.role === 'user' ? 'user-message' : 'assistant-message'}>
                                    {message.content}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="chat-input-container">
                        <TextArea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            autoSize={{ minRows: 1, maxRows: 5 }}
                            onPressEnter={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                        />
                        <Button type="primary" onClick={handleSendMessage}>
                            Send
                        </Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ChatPage;
