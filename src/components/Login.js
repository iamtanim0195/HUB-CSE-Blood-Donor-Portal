'use client';
import { auth, googleProvider } from '@/lib/firebase';
import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { useState, useEffect } from 'react';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

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

    const handleEmailPasswordAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Sign in existing user
                await signInWithEmailAndPassword(auth, email, password);
                console.log('User signed in successfully');
            } else {
                // Create new user
                await createUserWithEmailAndPassword(auth, email, password);
                console.log('User created successfully');
            }
        } catch (error) {
            console.error('Email/password auth error:', error);

            // Handle specific error cases
            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Invalid email address format.');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled.');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Please check your connection.');
                    break;
                default:
                    setError('Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await sendPasswordResetEmail(auth, email);
            setResetEmailSent(true);
            setError('');
        } catch (error) {
            console.error('Password reset error:', error);
            if (error.code === 'auth/user-not-found') {
                setError('No account found with this email address.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address format.');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setError('');
        setShowForgotPassword(false);
        setResetEmailSent(false);
    };

    return (
        <div className="text-black min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
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
                    <h2 className="text-3xl font-bold text-gray-900">
                        {showForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {showForgotPassword
                            ? 'Enter your email to reset your password'
                            : 'Sign in to access the CSE Blood Donor Portal'
                        }
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {resetEmailSent && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        Password reset email sent! Check your inbox.
                    </div>
                )}

                {!showForgotPassword ? (
                    <>
                        {/* Email/Password Form */}
                        <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="your.email@university.edu"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        {isLogin ? 'Signing in...' : 'Creating account...'}
                                    </div>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>
                        {/* Toggle between login and signup */}
                        <div className="text-center text-sm text-gray-600">
                            <p>
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        resetForm();
                                    }}
                                    className="text-red-600 hover:text-red-700 font-medium"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => setShowForgotPassword(true)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                                Forgot your password?
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Login Button */}
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
                    </>
                ) : (
                    /* Forgot Password Form */
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="your.email@university.edu"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Sending...
                                </div>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    resetForm();
                                }}
                                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                            >
                                Back to login
                            </button>
                        </div>
                    </form>
                )}

                
            </div>
        </div>
    );
}