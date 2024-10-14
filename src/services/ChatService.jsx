import apiClient from "../api/apiClient.jsx";
import {refreshAccessToken} from "./UserAuth.jsx";

// 发送消息服务：发送用户消息到后端，获取助手的回复
export const sendMessage = async (sessionId, content) => {
    try {
        const response = await apiClient.post('/api/send-message/', {
            session_id: sessionId,
            content: content,
            role: 'user',  // 用户发送消息
        });

        return response.data;  // 返回助手的回复
    } catch (error) {
        throw error;
    }
};

// 获取历史消息服务：获取某个会话的所有历史消息
export const getMessages = async (sessionId) => {
    try {
        const response = await apiClient.get(`/api/get-messages/${sessionId}/`);
        return response.data;  // 返回历史消息
    } catch (error) {
        throw error;
    }
};

// 获取会话列表服务：获取用户的所有历史会话
export const getSessions = async () => {
    try {
        const response = await apiClient.get('/api/get-sessions/');
        return response.data;  // 返回会话列表
    } catch (error) {
        throw error;
    }
};

// 创建新会话服务：开始一个新的会话
export const createSession = async () => {
    try {
        const response = await apiClient.post('/api/create-session/');
        return response.data;  // 返回新会话的 ID
    } catch (error) {
        throw error;
    }
};
