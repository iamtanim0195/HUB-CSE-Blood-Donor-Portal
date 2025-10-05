'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '@/components/Header';
import Login from '@/components/Login';
import UserForm from '@/components/UserForm';
import UserList from '@/components/UserList';
import SearchBar from '@/components/SearchBar';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    type: 'name',
    term: '',
    bloodGroup: '',
    availability: 'all'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if user is admin
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
        setIsAdmin(adminEmails.includes(user.email));

        // Fetch user data
        await fetchUserData(user.email);
        // Fetch all users
        await fetchUsers();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch('/api/users');
      const allUsers = await response.json();
      const currentUser = allUsers.find(u => u.email === email);
      setUserData(currentUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUsers = async (params = searchParams) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.term) {
        queryParams.append('search', params.term);
        queryParams.append('searchType', params.type);
      }
      if (params.bloodGroup) {
        queryParams.append('bloodGroup', params.bloodGroup);
      }
      if (params.availability && params.availability !== 'all') {
        queryParams.append('availability', params.availability);
      }

      const url = `/api/users?${queryParams.toString()}`;
      const response = await fetch(url);
      const usersData = await response.json();

      // Filter out current user from the list
      setUsers(usersData.filter(u => u.email !== user?.email));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = async (searchParams) => {
    setSearchParams(searchParams);
    await fetchUsers(searchParams);
  };

  const handleFilter = async (filterParams) => {
    const newParams = {
      ...searchParams,
      ...filterParams
    };
    setSearchParams(newParams);
    await fetchUsers(newParams);
  };

  const handleSaveUser = async (formData) => {
    try {
      const userInfo = {
        ...formData,
        email: user.email,
        uid: user.uid,
        lastUpdated: new Date().toISOString()
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        await fetchUserData(user.email);
        await fetchUsers();
        alert('Information saved successfully!');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving information');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers();
        alert('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <BackgroundAnimation />
      <Header user={user} isAdmin={isAdmin} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Form Section */}
        <UserForm
          user={user}
          userData={userData}
          onSave={handleSaveUser}
        />

        {/* Search Section */}
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
        />

        {/* User List Section */}
        <UserList
          users={users}
          isAdmin={isAdmin}
          onDeleteUser={handleDeleteUser}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}