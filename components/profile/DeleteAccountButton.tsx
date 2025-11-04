// components/profile/DeleteAccountButton.tsx
'use client'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useBodyScrollLock } from '@/app/hooks/useBodyScrollLock'

interface DeleteAccountButtonProps {
    userId: string
}

export default function DeleteAccountButton({ userId }: DeleteAccountButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useBodyScrollLock(showModal)

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') return

        setIsDeleting(true)
        try {
            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            })

            if (response.ok) {
                await signOut({ callbackUrl: '/' })
            } else {
                alert('Failed to delete account. Please try again.')
                setIsDeleting(false)
            }
        } catch (error) {
            console.error('Error deleting account:', error)
            alert('An error occurred. Please try again.')
            setIsDeleting(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Delete Account
            </button>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm opacity-100 duration-200 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Delete Account
                            </h3>
                            <p className="text-sm text-gray-500 text-center mb-4">
                                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <span className="font-bold">DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="DELETE"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setShowModal(false)
                                        setConfirmText('')
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={confirmText !== 'DELETE' || isDeleting}
                                    className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}