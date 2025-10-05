'use client';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Image from 'next/image';

export default function Header({ user, isAdmin }) {
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="bg-white shadow-lg border-b-4 border-red-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                            <Image
                                src="/image/hub.jpg"
                                alt="University Logo"
                                width={80}
                                height={80}
                                className="object-cover rounded-full w-full h-full"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                HUB CSE Blood Donor Portal
                            </h1>
                            <p className="text-sm text-gray-600">Save Lives, Donate Blood</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <span className="text-gray-700">
                                    Welcome, {user.displayName || user.email}
                                </span>
                                {isAdmin && (
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Admin
                                    </span>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}