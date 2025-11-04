// app/profile/edit/page.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/api-auth'
import ProfileForm from './ProfileForm'

export default async function ProfileEditPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/profile"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Profile
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="mt-2 text-gray-600">Update your account information</p>
                </div>

                <ProfileForm user={user} />
            </div>
        </div>
    )
}