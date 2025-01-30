import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', surname: '', PESEL: '', phone_number: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
        setFormData({
          name: data.name,
          surname: data.surname,
          PESEL: data.PESEL || '',
          phone_number: data.phone_number || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    

    fetchUserData();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    console.log(JSON.stringify(formData))
    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setIsEditing(false);
        setUserData({ ...userData, ...formData });
      } else {
        console.error('Failed to update user data:', await response.text());
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeIndex={7} />

      {/* Główna zawartość */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="flex-grow p-8 bg-gray-100 overflow-hidden flex flex-col">
          <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
          {userData ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {isEditing ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Surname</label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">PESEL</label>
                    <input
                      type="text"
                      name="PESEL"
                      value={formData.PESEL}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div>
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Surname:</strong> {userData.surname}</p>
                  <p><strong>PESEL:</strong> {userData.PESEL || 'Not provided'}</p>
                  <p><strong>Phone Number:</strong> {userData.phone_number || 'Not provided'}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
