'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    avatar: string | null;
    phone: string | null;
    isActive: boolean;
    lastLogin: string | null;
    createdAt: string;
    _count: {
        orders: number;
    };
}

interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(search && { search }),
                ...(roleFilter !== 'ALL' && { role: roleFilter }),
            });

            const response = await fetch(`/api/admin/users?${params}`);
            if (response.ok) {
                const data: UsersResponse = await response.json();
                setUsers(data.users);
                setTotalPages(data.totalPages);
            } else {
                setError('Failed to fetch users');
            }
        } catch (error) {
            setError('Error fetching users');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [page, search, roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [page, search, roleFilter, fetchUsers]);



    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                // Update local state
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                ));
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update user role');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            setError('Error updating user role');
        }
    };

    const deactivateUser = async (userId: string) => {
        if (!confirm('Are you sure you want to deactivate this user?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(users.filter(user => user.id !== userId));
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to deactivate user');
            }
        } catch (error) {
            console.error('Error deactivating user:', error);
            setError('Error deactivating user');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-800';
            case 'USER':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-lg">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>
                    <Link
                        href="/admin/users/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Add New User
                    </Link>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="USER">Users</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Orders
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-medium">
                                                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name || 'No Name'}
                                                </div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                                            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 ${getRoleBadgeColor(user.role)} focus:ring-2 focus:ring-blue-500`}
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user._count.orders}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => deactivateUser(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Deactivate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500 mb-4">
                            {search || roleFilter !== 'ALL'
                                ? 'Try adjusting your search criteria'
                                : 'Get started by adding your first user'
                            }
                        </p>
                        {!search && roleFilter === 'ALL' && (
                            <Link
                                href="/admin/users/new"
                                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Add New User
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}