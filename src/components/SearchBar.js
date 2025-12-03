'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('bloodGroup');
    const [bloodGroup, setBloodGroup] = useState('');
    const [availability, setAvailability] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();

        onSearch({
            searchType,
            searchTerm: searchType === 'bloodGroup' ? bloodGroup : searchTerm,
            bloodGroup,
            availability,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setBloodGroup('');
        setAvailability('all');
        onSearch({ searchType: 'all', searchTerm: '', bloodGroup: '', availability: 'all' });
    };

    return (
        <div className="text-black shadow-xl rounded-xl p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">

                {/* Search Type */}
                <select
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                        setSearchTerm('');
                        setBloodGroup('');
                    }}
                    className="w-full md:w-40 px-3 py-2 border rounded-lg"
                >
                    <option value="name">Name</option>
                    <option value="id">Student ID</option>
                    <option value="location">Location</option>
                    <option value="bloodGroup">Blood Group</option>
                </select>

                {/* Search Input OR Dropdown */}
                {searchType !== 'bloodGroup' ? (
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search by ${searchType}...`}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                ) : (
                    <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                )}

                {/* Search Button */}
                <button
                    type="submit"
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                    <FaSearch className="inline-block mr-2" />
                    Search
                </button>
            </form>

            {/* Filters Toggle */}
            <div className="mt-4 flex items-center justify-between">
                <button
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FaFilter />
                    Filters
                </button>

                <button className="text-red-600" onClick={clearFilters}>
                    Clear All
                </button>
            </div>

            {/* Extra Filters */}
            {showFilters && (
                <div className="mt-4 border-t pt-4">

                    {/* Availability Filter */}
                    <label className="block mb-1 font-medium">Availability</label>
                    <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="all">All</option>
                        <option value="available">Available Only</option>
                        <option value="unavailable">Unavailable Only</option>
                    </select>
                </div>
            )}
        </div>
    );
}
