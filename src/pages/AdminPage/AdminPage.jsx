import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Table, Switch, Button, Input, Space, Pagination } from 'antd';
import { UserOutlined, HomeOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { getAllUsers, checkAdminPermission, updateUserPermissions } from '../../services/AdminService';  // 引入API服务
import './AdminPage.css';
import {getUserInfo} from "../../services/UserAuth.jsx";

const { Header, Sider, Content } = Layout;

const AdminPage = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [userRole, setUserRole] = useState('');  // 存储用户角色（superuser 或 staff）
    const [userData, setUserData] = useState([]);  // 存储用户数据
    const [searchData, setSearchData] = useState([]); // 存储搜索结果
    const [searchTerm, setSearchTerm] = useState(''); // 搜索关键词
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);  // 每页显示8条数据
    const [username, setUsername] = useState('');  // 当前用户名
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await checkAdminPermission();  // 检查用户权限
                if (data.is_admin) {
                    setHasPermission(true);
                    setUserRole(data.role);  // 设置用户角色
                    loadUsers();  // 加载用户数据
                } else {
                    navigate('/login');  // 没有权限，跳转到登录页面
                }
            } catch (error) {
                console.error('Failed to check permissions:', error);
                navigate('/login');  // 发生错误时跳转到登录页面
            }
        };

        fetchPermissions();
    }, [navigate]);

    useEffect(() => {
        loadUserInfo();  // 加载用户信息
    }, []);

    const loadUserInfo = async () => {
        try {
            const userInfo = await getUserInfo();  // 获取用户信息
            setUsername(userInfo.username);  // 假设userInfo中包含username字段
        } catch (error) {
            console.error('Failed to load user info', error);
        }
    };

    // 加载用户数据
    const loadUsers = async () => {
        try {
            const users = await getAllUsers();  // 获取所有用户数据
            setUserData(users);
            setSearchData(users); // 初始化搜索结果与全部用户数据一致
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    // 更新用户权限
    const handlePermissionChange = async (record, key, value) => {
        // 检查当前用户角色权限
        if (userRole !== 'superuser' && (key === 'is_superuser' || key === 'is_active')) {
            return;  // 如果当前用户不是超级管理员，不能修改 is_superuser
        }

        const updatedUser = { ...record, [key]: value };

        // 如果是修改 is_superuser，自动开启 is_staff
        if (key === 'is_superuser' && value) {
            updatedUser.is_staff = true;  // 超级管理员必须也是员工
        }

        if (key === 'is_staff' && !value) {
            updatedUser.is_superuser = false;  // 当 is_staff 为 false 时，自动关闭 is_superuser
        }

        // 调用API更新用户权限
        try {
            await updateUserPermissions(updatedUser);  // 更新后端数据
            setUserData((prevData) =>
                prevData.map((user) =>
                    user.uuid === updatedUser.uuid ? updatedUser : user
                )
            );
            setSearchData((prevData) =>
                prevData.map((user) =>
                    user.uuid === updatedUser.uuid ? updatedUser : user
                )
            );
        } catch (error) {
            console.error('Failed to update permissions', error);
        }
    };

    const columns = [
        {
            title: 'UUID',
            dataIndex: 'uuid',
            key: 'uuid',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Is Active?',
            key: 'is_active',
            render: (_, record) => (
                <Switch
                    checked={record.is_active}
                    onChange={(value) => handlePermissionChange(record, 'is_active', value)}
                    disabled={userRole !== 'superuser'}  // 禁用普通管理员修改 is_active
                />
            ),
        },
        {
            title: 'Is Staff?',
            key: 'is_staff',
            render: (_, record) => (
                <Switch
                    checked={record.is_staff}
                    onChange={(value) => handlePermissionChange(record, 'is_staff', value)}
                />
            ),
        },
        {
            title: 'Is Superuser?',
            key: 'is_superuser',
            render: (_, record) => (
                <Switch
                    checked={record.is_superuser}
                    onChange={(value) => handlePermissionChange(record, 'is_superuser', value)}
                    disabled={userRole !== 'superuser'}  // 禁用普通管理员修改 is_superuser
                />
            ),
        }
    ];


    // 处理分页切换
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 处理搜索
    const handleSearch = (value) => {
        setSearchTerm(value);  // 设置搜索关键词
        if (value) {
            const filteredData = userData.filter(
                (user) =>
                    user.username.toLowerCase().includes(value.toLowerCase()) ||
                    user.email.toLowerCase().includes(value.toLowerCase())
            );
            setSearchData(filteredData);  // 更新搜索结果
        } else {
            setSearchData(userData);  // 如果没有输入关键词，恢复为完整数据
        }
        setCurrentPage(1);  // 搜索后从第一页开始展示
    };

    // 根据当前页面进行分页
    const paginatedData = searchData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleLogout = () => {
        localStorage.removeItem('access_token');  // 清除token
        navigate('/login');  // 跳转到登录页面
    };

    // 权限检查
    if (!hasPermission) {
        return <div>Loading...</div>;  // 等待权限检查结果
    }

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ marginTop: '16px' }}>
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        DashBoard
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        UserList
                    </Menu.Item>
                    <Menu.Item key="3" icon={<SettingOutlined />}>
                        Statistics
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background header" style={{ padding: 0 }}>
                    <span style={{ marginRight: '10px' }}>Hello, {username}</span>
                    <Button type="link" onClick={handleLogout}>
                        Logout
                    </Button>
                </Header>
                <Content style={{ margin: '16px' }}>
                    {/* 根据角色渲染不同的内容 */}
                    <h1 style={{ color: "black", textAlign: 'center' }}>
                        {userRole === 'superuser' ? 'Superuser Dashboard' : 'Staff Dashboard'}
                    </h1>
                    <div className="table-toolbar">
                        <Space>
                            <Input.Search
                                placeholder="Search here"
                                enterButton="Search"
                                onSearch={handleSearch}  // 绑定搜索函数
                                style={{ width: 300 }}
                            />
                        </Space>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={paginatedData}
                        pagination={false}
                    />
                    <div className="pagination-wrapper">
                        <Pagination
                            current={currentPage}
                            total={searchData.length}  // 分页数据的总条数
                            pageSize={itemsPerPage}
                            onChange={handlePageChange}
                        />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminPage;
