import React from 'react'

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-gray-600">
                    <p>© 2025 Hamdard University Bangladesh CSE Department - Blood Donor Portal</p>
                    <p className="text-sm mt-2">Together we can save lives</p>

                    {/* Developer Credit */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            Developed by{' '}
                            <a
                                href="https://iamtanim0195.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-500 hover:text-red-600 underline transition duration-200"
                            >
                                Md. Sahadat Hossen Tanim
                            </a>
                            <span> Batch 24</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}