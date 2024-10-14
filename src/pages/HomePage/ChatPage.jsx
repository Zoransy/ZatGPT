import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Input, Button, List } from 'antd';
import { PlusOutlined, MenuOutlined } from '@ant-design/icons';
import './ChatPage.css';

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;

const ChatPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [sessions, setSessions] = useState([]);  // 会话列表
    const [currentSessionId, setCurrentSessionId] = useState(null);  // 当前会话ID
    const [messages, setMessages] = useState([]);  // 当前会话的消息
    const [inputMessage, setInputMessage] = useState('');  // 输入框中的消息
    const chatContainerRef = useRef(null);

    // 初始化加载会话列表
    useEffect(() => {
        loadSessions();
    }, []);

    // 加载会话列表
    const loadSessions = async () => {
        const mockSessions = [{ id: 1, title: 'Chat 1' }, { id: 2, title: 'Chat 2' }];
        setSessions(mockSessions);
    };

    // 切换会话
    const handleSessionClick = (sessionId) => {
        setCurrentSessionId(sessionId);
        loadMessages(sessionId);  // 加载选中的会话消息
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
        setMessages([...messages, newMessage]);
        setInputMessage('');  // 清空输入框

        // 模拟助手回复
        const assistantReply = { role: 'assistant', content: 'Got it!' };
        setMessages((prevMessages) => [...prevMessages, newMessage, assistantReply]);
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
                        onClick={() => console.log('New Chat')}
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
                </Header>
                <Content className="chat-content">
                    <div ref={chatContainerRef} className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={message.role === 'user' ? 'user-message' : 'assistant-message'}>
                                {message.content}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-container">
                        <TextArea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            autoSize={{ minRows: 1, maxRows: 5 }}
                            onPressEnter={handleSendMessage}
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
