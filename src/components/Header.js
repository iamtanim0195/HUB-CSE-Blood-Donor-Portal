'use client';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import { useState } from 'react';

export default function Header({ user, isAdmin }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="bg-white shadow-lg border-b-4 border-red-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mobile Layout - Stacked */}
                <div className="md:hidden">
                    {/* Logo - Top Center */}
                    <div className="flex justify-center py-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                            <Image
                                src="/image/hub.jpg"
                                alt="University Logo"
                                width={80}
                                height={80}
                                className="object-cover rounded-full w-full h-full"
                                priority
                            />
                        </div>
                    </div>

                    {/* Title - Below Logo */}
                    <div className="text-center pb-3">
                        <h1 className="text-xl font-bold text-gray-900">
                            HUB CSE Blood Donor Portal
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Save Lives, Donate Blood
                        </p>
                    </div>

                    {/* User Info and Menu Button */}
                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                        {user && (
                            <>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-700 text-sm">
                                        Welcome, {user.displayName || user.email}
                                    </span>
                                    {isAdmin && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition duration-200 text-sm"
                                    >
                                        Logout
                                    </button>
                                    
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Desktop Layout - Original (Unchanged) */}
                <div className="hidden md:flex justify-between items-center py-4">
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

                {/* Mobile Menu */}
                {user && isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4 px-2 bg-white">
                        <div className="flex flex-col space-y-3">
                            <div className="text-center">
                                <span className="text-gray-700 font-medium block mb-2">
                                    Welcome, {user.displayName || user.email}
                                </span>
                                {isAdmin && (
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                                        Admin
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition duration-200 w-full text-center font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}