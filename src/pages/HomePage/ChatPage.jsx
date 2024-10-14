import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSessions, sendMessage, createSession, getMessages } from '../../services/ChatService.jsx';
import { getUserInfo } from '../../services/UserAuth.jsx';
import './ChatPage.css';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;

const ChatPage = () => {
    const [sessions, setSessions] = useState({});  // 按日期分组的会话列表
    const [currentSessionId, setCurrentSessionId] = useState(null);  // 当前会话ID
    const [messages, setMessages] = useState([]);  // 当前会话的消息
    const [inputMessage, setInputMessage] = useState('');  // 输入框中的消息
    const [hasSentMessage, setHasSentMessage] = useState(false);  // 是否已经发送消息
    const [username, setUsername] = useState('');  // 当前用户名
    const chatContainerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [isNewSession, setIsNewSession] = useState(false);

    // 从 URL 获取 session_id，如果存在则设置
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const sessionIdFromURL = searchParams.get('session_id');
        if (sessionIdFromURL) {
            setCurrentSessionId(sessionIdFromURL);
            if(!isNewSession) {
                loadMessages(sessionIdFromURL);
                setHasSentMessage(true);
            }
        }
    }, [location.search]);

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

    // 加载会话列表并按日期分组
    const loadSessions = async () => {
        try {
            const sessionsData = await getSessions();  // 从后端获取会话列表
            const sessionsByDate = groupSessionsByDate(sessionsData.sessions);  // 按日期分组会话
            setSessions(sessionsByDate);
        } catch (error) {
            console.error('Failed to load sessions', error);
        }
    };

    // 按日期分组会话
    const groupSessionsByDate = (sessions) => {
        const grouped = {};
        sessions.forEach((session) => {
            const sessionDate = new Date(session.date).toLocaleDateString();  // 将日期转为可读的日期格式
            if (!grouped[sessionDate]) {
                grouped[sessionDate] = [];
            }
            grouped[sessionDate].push(session);
        });
        return grouped;
    };

    // 加载当前会话的消息
    const loadMessages = async (sessionId) => {
        try {
            const messagesData = await getMessages(sessionId);  // 获取会话消息
            const filteredMessages = messagesData.messages.filter(
                message => message.role !== 'system'  // 过滤掉 'system' 消息
            );
            setMessages(filteredMessages);
        } catch (error) {
            console.error('Failed to load messages', error);
        }
    };

    // 切换会话
    const handleSessionClick = async (sessionId) => {
        setCurrentSessionId(sessionId);
        navigate(`?session_id=${sessionId}`);  // 更新 URL 中的 session_id
        await loadMessages(sessionId);  // 加载选中的会话消息
        setHasSentMessage(true);  // 标记已经发送消息
    };

    // 发送消息
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        setLoading(true);
        let sessionId = currentSessionId;
        const sendMessageWithSession = async (sessionId) => {
            // 发送用户消息
            try {
                const response = await sendMessage(sessionId, inputMessage);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: 'user', content: inputMessage },
                    { role: 'assistant', content: response.assistant_message },
                ]);
                setInputMessage('');  // 清空输入框
                setHasSentMessage(true);  // 设置已发送消息状态
                setLoading(false);
            } catch (error) {
                console.error('Failed to send message', error);
                setLoading(false);
            }
        };

        // 如果没有 session_id 则创建新会话
        if (!sessionId) {
            try {
                setIsNewSession(true);
                const sessionData = await createSession();
                sessionId = sessionData.session_id;  // 使用创建的 session_id
                setCurrentSessionId(sessionId);      // 更新 React 状态中的 session_id
                navigate(`?session_id=${sessionId}`, { replace: true });  // 更新 URL
                await sendMessageWithSession(sessionId);   // 使用返回的 session_id 发送消息
                setIsNewSession(true);
            } catch (error) {
                console.error('Failed to create session', error);
                setLoading(false);
            }
        } else {
            // 如果已有 session_id，直接发送消息
            await sendMessageWithSession(sessionId);
        }
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
            <Sider width={260} className="side-bar">
                <div className="new-chat-button">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        block
                        onClick={() => {
                            navigate('/chat');  // 重置 URL，进入新会话
                            setHasSentMessage(false);  // 新建会话时，重置消息发送状态
                            setMessages([]);  // 清空消息
                            setCurrentSessionId(null);  // 清空当前会话ID
                        }}
                    >
                        New Chat
                    </Button>
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={[currentSessionId]} style={{ fontSize: '15px' }}>
                    {Object.keys(sessions).length > 0 ? (
                        Object.entries(sessions).map(([date, sessionsOnDate]) => (
                            <Menu.ItemGroup key={date} title={date}>
                                {sessionsOnDate.map((session) => (
                                    <Menu.Item key={session.session_id} onClick={() => handleSessionClick(session.session_id)}>
                                        <span className="menu-item-title">{session.title}</span>
                                    </Menu.Item>
                                ))}
                            </Menu.ItemGroup>
                        ))
                    ) : (
                        <Menu.Item disabled>No sessions available</Menu.Item>
                    )}
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
                                <h3>How can I assist you today?</h3>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div key={index} className={message.role === 'user' ? 'user-message' : 'assistant-message'}>
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={atomDark}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
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
                        <Button
                            type="primary"
                            onClick={handleSendMessage}
                            loading={loading}  // 在加载时显示加载状态
                        >
                            {loading ? 'Sending...' : 'Send'}
                        </Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ChatPage;
