'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SearchBar({ onSearch, onFilter }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name'); // name, id, location, bloodGroup
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, unavailable

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({
            type: searchType,
            term: searchTerm,
            bloodGroup: selectedBloodGroup,
            availability: availabilityFilter
        });
    };

    const handleFilterChange = () => {
        onFilter({
            bloodGroup: selectedBloodGroup,
            availability: availabilityFilter
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedBloodGroup('');
        setAvailabilityFilter('all');
        onSearch({
            type: 'name',
            term: '',
            bloodGroup: '',
            availability: 'all'
        });
    };

    useEffect(() => {
        handleFilterChange();
    }, [selectedBloodGroup, availabilityFilter]);

    const getSearchPlaceholder = () => {
        switch (searchType) {
            case 'name':
                return 'Search by student name...';
            case 'id':
                return 'Search by student ID...';
            case 'location':
                return 'Search by address or location...';
            case 'bloodGroup':
                return 'Search by blood group...';
            default:
                return 'Search...';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 text-gray-900">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Find Blood Donors
                </h3>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                        <FaFilter className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Filters</span>
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium transition duration-200"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 flex flex-col md:flex-row gap-4">
                    {/* Search Type Selector */}
                    <div className="w-full md:w-40">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                        >
                            <option value="name">Name</option>
                            <option value="id">Student ID</option>
                            <option value="location">Location</option>
                            <option value="bloodGroup">Blood Group</option>
                        </select>
                    </div>

                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={getSearchPlaceholder()}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
                >
                    Search
                </button>
            </form>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Blood Group Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Blood Group
                            </label>
                            <select
                                value={selectedBloodGroup}
                                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                            >
                                <option value="">All Blood Groups</option>
                                {bloodGroups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>

                        {/* Availability Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Availability Status
                            </label>
                            <select
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                            >
                                <option value="all">All Donors</option>
                                <option value="available">Available Only</option>
                                <option value="unavailable">Unavailable Only</option>
                            </select>
                        </div>

                        {/* Quick Blood Group Buttons */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quick Blood Groups
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['A+', 'B+', 'O+', 'AB+'].map(group => (
                                    <button
                                        key={group}
                                        type="button"
                                        onClick={() => setSelectedBloodGroup(group)}
                                        className={`px-3 py-1 text-sm rounded-full border transition duration-200 ${selectedBloodGroup === group
                                                ? 'bg-red-500 text-white border-red-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {group}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {selectedBloodGroup && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                                Blood Group: {selectedBloodGroup}
                                <button
                                    onClick={() => setSelectedBloodGroup('')}
                                    className="hover:text-red-900"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {availabilityFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {availabilityFilter === 'available' ? 'Available' : 'Unavailable'}
                                <button
                                    onClick={() => setAvailabilityFilter('all')}
                                    className="hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {searchTerm && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {searchType}: {searchTerm}
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="hover:text-green-900"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}