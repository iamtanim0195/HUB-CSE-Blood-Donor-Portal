'use client';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { useState, useEffect } from 'react';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Using consistent 'error' name

    // Handle redirect result
    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    console.log('Login successful via redirect');
                }
            })
            .catch((error) => {
                console.error('Redirect result error:', error);
                setError('Login failed. Please try again.');
            });
    }, []);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Login error:', error);

            if (error.code === 'auth/popup-blocked' ||
                error.message.includes('sessionStorage') ||
                error.message.includes('initial state')) {

                // Fallback to redirect for mobile/popup issues
                await signInWithRedirect(auth, googleProvider);
            } else if (error.code === 'auth/popup-closed-by-user') {
                setError('Login popup was closed. Please try again.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        <Image
                            src="/image/hub.jpg"
                            alt="University Logo"
                            width={80}
                            height={80}
                            className="object-cover rounded-full w-full h-full"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">
                        Sign in to access the CSE Blood Donor Portal
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        ) : (
                            <FcGoogle className="w-6 h-6" />
                        )}
                        <span className="font-medium">
                            {loading ? 'Signing in...' : 'Continue with Google'}
                        </span>
                    </button>
                </div>

                <div className="text-center text-sm text-gray-500">
                    <p>Only university email addresses are allowed</p>
                </div>
            </div>
        </div>
    );
}