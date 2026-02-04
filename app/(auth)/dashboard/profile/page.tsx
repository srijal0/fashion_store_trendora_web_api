"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Anna Petrova",
    email: "anna.petrova@example.com",
    phone: "+7 (999) 123-45-67",
    address: "Moscow, Sadovaya st., 15, apt. 42",
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    alert("Profile updated!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-8 border border-pink-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="px-6 py-2 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition">
                  ✏️ Edit
                </button>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input type="text" value={editedProfile.name} onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })} className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300" />
                ) : (
                  <p className="text-gray-800 text-lg">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input type="email" value={editedProfile.email} onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })} className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300" />
                ) : (
                  <p className="text-gray-800 text-lg">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input type="tel" value={editedProfile.phone} onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })} className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300" />
                ) : (
                  <p className="text-gray-800 text-lg">{profile.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <textarea value={editedProfile.address} onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })} rows={3} className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300" />
                ) : (
                  <p className="text-gray-800 text-lg">{profile.address}</p>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button onClick={handleSave} className="flex-1 py-3 px-6 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition font-semibold">
                    Save Changes
                  </button>
                  <button onClick={() => { setEditedProfile(profile); setIsEditing(false); }} className="flex-1 py-3 px-6 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition font-medium">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-pink-100">
            <h3 className="font-bold text-gray-800 mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-bold text-pink-500 text-xl">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Favorites</span>
                <span className="font-bold text-pink-500 text-xl">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Points</span>
                <span className="font-bold text-pink-500 text-xl">450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}