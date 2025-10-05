'use client';
import { FaPhone, FaMapMarkerAlt, FaTint, FaUser, FaTrash, FaCrown, FaGraduationCap } from 'react-icons/fa';

export default function UserList({ users, isAdmin, onDeleteUser }) {
    const handleDeleteClick = async (userId, userName) => {
        if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            try {
                await onDeleteUser(userId);
            } catch (error) {
                console.error('Error in UserList delete:', error);
            }
        }
    };

    if (users.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No donors found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
        );
    }

    return (
        <div>
            {/* Results Header with Admin Badge */}
            <div className="flex items-center justify-between mb-6 text-gray-600">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Available Blood Donors
                        {isAdmin && (
                            <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1 w-fit mt-2">
                                <FaCrown className="text-yellow-300" />
                                Admin Mode
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-600">
                        {users.length} donor{users.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                    <select
                        onChange={(e) => {
                            console.log('Sort by:', e.target.value);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-sm"
                    >
                        <option value="name">Name A-Z</option>
                        <option value="nameDesc">Name Z-A</option>
                        <option value="batch">Batch</option>
                        <option value="bloodGroup">Blood Group</option>
                        <option value="recent">Recently Updated</option>
                    </select>
                </div>
            </div>



            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition duration-200 relative"
                    >
                        {/* Admin Delete Button - More Visible */}
                        {isAdmin && (
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => handleDeleteClick(user._id, user.name)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-200 shadow-lg flex items-center gap-1 text-sm"
                                    title={`Delete ${user.name}`}
                                >
                                    <FaTrash className="text-white" />
                                </button>
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex items-start mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                        <FaUser className="text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-500">ID: {user.studentId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Batch Information */}
                                <div className="flex items-center">
                                    <FaGraduationCap className="text-purple-500 mr-3" />
                                    <div>
                                        <span className="font-medium text-gray-700">Batch:</span>
                                        <span className="ml-2 text-purple-600 font-medium">{user.batch}</span>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <FaTint className={`text-red-500 mr-3 ${user.bloodGroup.includes('+') ? 'pulse-red' : ''
                                        }`} />
                                    <div>
                                        <span className="font-medium text-gray-700">Blood Group:</span>
                                        <span className={`ml-2 font-bold ${user.bloodGroup.includes('O') ? 'text-red-600' :
                                            user.bloodGroup.includes('A') ? 'text-blue-600' :
                                                user.bloodGroup.includes('B') ? 'text-green-600' : 'text-purple-600'
                                            }`}>
                                            {user.bloodGroup}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <FaPhone className="text-green-500 mr-3" />
                                    <div>
                                        <span className="font-medium text-gray-700">Contact:</span>
                                        <span className="ml-2 text-gray-600">{user.contactNumber}</span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="text-blue-500 mr-3 mt-1" />
                                    <div>
                                        <span className="font-medium text-gray-700">Address:</span>
                                        <p className="ml-2 text-gray-600 text-sm">{user.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={`mt-4 text-center py-2 rounded-lg ${user.isAvailable
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                {user.isAvailable ? '✅ Available for Donation' : '❌ Currently Unavailable'}
                            </div>

                            {/* Last Updated */}
                            {user.lastUpdated && (
                                <div className="mt-3 text-xs text-gray-500 text-center">
                                    Updated: {new Date(user.lastUpdated).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}