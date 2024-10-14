import axios from 'axios';

// 从 Vite 环境变量中获取后端 API 的 URL
const API_URL = import.meta.env.VITE_API_URL;

// 获取 JWT Token
const getAccessToken = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error("No access token found, user might not be authenticated");
    }
    return accessToken;
};

// 发送消息服务：发送用户消息到后端，获取助手的回复
export const sendMessage = async (sessionId, content) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.post(`${API_URL}/api/send-message/`, {
            session_id: sessionId,
            content: content,
            role: 'user',  // 用户发送消息
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;  // 返回助手的回复
    } catch (error) {
        throw error;
    }
};

// 获取历史消息服务：获取某个会话的所有历史消息
export const getMessages = async (sessionId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(`${API_URL}/api/get-messages/${sessionId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;  // 返回历史消息
    } catch (error) {
        throw error;
    }
};

// 创建新会话服务：开始一个新的会话
export const createSession = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.post(`${API_URL}/api/create-session/`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;  // 返回新会话的 ID
    } catch (error) {
        throw error;
    }
};

// 获取会话列表服务：获取用户的所有历史会话
export const getSessions = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(`${API_URL}/api/get-sessions/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;  // 返回会话列表
    } catch (error) {
        throw error;
    }
};

// 删除会话服务（可选）：删除指定的历史会话
export const deleteSession = async (sessionId) => {
    try {
        const accessToken = await getAccessToken();
        await axios.delete(`${API_URL}/api/delete-session/${sessionId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        throw error;
    }
};
