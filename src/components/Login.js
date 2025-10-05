'use client';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Login error:', error);
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

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition duration-200 shadow-sm"
                    >
                        <FcGoogle className="w-6 h-6" />
                        <span className="font-medium">Continue with Google</span>
                    </button>
                </div>

                <div className="text-center text-sm text-gray-500">
                    <p>Only university email addresses are allowed</p>
                </div>
            </div>
        </div>
    );
}