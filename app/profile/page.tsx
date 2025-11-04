// app/profile/page.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getOrders } from '@/app/actions/profile'
import { getCurrentUser } from '@/lib/api-auth'
import Image from 'next/image'

export default async function ProfilePage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/login')
    }

    const orders = await getOrders(user.id)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="mt-2 text-gray-600">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow">
                    {/* Profile Header */}
                    <div className="px-6 py-8 border-b border-gray-200">
                        <div className="flex items-center space-x-6">
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt={user.name || 'User'}
                                    width={100}
                                    height={100}
                                    className="rounded-full ring-4 ring-gray-100"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-semibold ring-4 ring-gray-100">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user.name || 'User'}</h2>
                                <p className="text-gray-600 mt-1">{user.email}</p>
                                <div className="mt-3 flex items-center text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="px-6 py-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Address</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user.address || 'Not provided'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Account Role</dt>
                                <dd className="mt-1 text-sm text-gray-900 capitalize">{user.role}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                                <dd className="mt-1 text-gray-900 font-mono text-xs">{user.id}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Order Statistics */}
                    <div className="px-6 py-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                                <div className="text-sm text-gray-600">Total Orders</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                    {orders.filter(order => order.status === 'DELIVERED').length}
                                </div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                    {orders.filter(order => order.status === 'PENDING').length}
                                </div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                    {orders.filter(order => order.status === 'PROCESSING').length}
                                </div>
                                <div className="text-sm text-gray-600">Processing</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 rounded-b-lg flex space-x-4">
                        <Link
                            href="/profile/edit"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </Link>
                        <Link
                            href="/settings"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Go to Settings
                        </Link>
                        <Link
                            href="/orders"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}