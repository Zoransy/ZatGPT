import apiClient from '../api/apiClient';  // 假设有一个已经配置好的 axios 实例

// 检查管理员权限
export const checkAdminPermission = async () => {
    try {
        const response = await apiClient.get('/api/check-admin-permission/');
        return response.data;  // 返回权限数据
    } catch (error) {
        throw error;
    }
};

// 获取所有用户数据
export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/api/get-all-users/');
        return response.data;  // 返回用户列表数据
    } catch (error) {
        throw error;
    }
};

export const updateUserPermissions = async (updatedUser) => {
    try {
        const response = await apiClient.post('/api/update-user-permissions/', {
            uuid: updatedUser.uuid,
            is_active: updatedUser.is_active,  // 超级管理员可以修改
            is_staff: updatedUser.is_staff,  // 管理员和超级管理员都可以修改
            is_superuser: updatedUser.is_superuser,  // 超级管理员可以修改
        });
        return response.data;  // 返回服务器的响应
    } catch (error) {
        throw error;  // 抛出错误
    }
};