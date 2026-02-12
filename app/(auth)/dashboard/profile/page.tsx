"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);
  const [loading, setLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const userProfile: ProfileData = {
            name: user.name || user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
          };
          setProfile(userProfile);
          setEditedProfile(userProfile);

          // Fetch profile image
          const userId = user.id || user._id;
          if (userId) {
            try {
              const response = await fetch(
                `http://localhost:8000/api/upload/profile-image/${userId}`
              );
              if (response.ok) {
                const imageData = await response.json();
                if (imageData.data?.imageUrl) {
                  const fullImageUrl = `http://localhost:8000${imageData.data.imageUrl}`;
                  setProfilePhoto(fullImageUrl);
                  localStorage.setItem("profilePhoto", fullImageUrl);
                }
              }
            } catch (error) {
              console.error("Error fetching profile image:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Upload profile photo
  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === "string") {
        setProfilePhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const userData = localStorage.getItem("user");
      if (!userData) return alert("User not logged in");

      const user = JSON.parse(userData);
      const userId = user.id || user._id;

      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);

      const response = await fetch(
        "http://localhost:8000/api/upload/profile-image",
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Failed to upload photo");

      const data = await response.json();
      if (data.data?.imageUrl) {
        const fullImageUrl = `http://localhost:8000${data.data.imageUrl}`;
        setProfilePhoto(fullImageUrl);
        localStorage.setItem("profilePhoto", fullImageUrl);
      }

      alert("Profile photo updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload photo");
    }
  };

  // Delete profile photo
  const handleDeletePhoto = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return alert("User not logged in");

      const user = JSON.parse(userData);
      const userId = user.id || user._id;

      const response = await fetch(
        `http://localhost:8000/api/upload/profile-image/${userId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete photo");

      setProfilePhoto(null);
      localStorage.removeItem("profilePhoto");
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Profile photo deleted!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete photo");
    }
  };

  // Save profile
  const handleSave = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = { ...user, ...editedProfile };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setProfile(editedProfile);
      setIsEditing(false);
      alert("Profile updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading Trendora profile...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-12 min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl px-4">
        <div className="bg-white rounded-2xl p-8 border border-pink-100 shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              My Trendora Profile
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {/* Profile Photo */}
          <div className="mb-6 flex items-center gap-6">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-pink-200 bg-gray-100 flex items-center justify-center">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl text-gray-300">👤</span>
              )}
            </div>

            {isEditing && (
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="px-4 py-2 bg-pink-500 text-white rounded-full cursor-pointer hover:bg-pink-600 transition text-sm font-medium"
                >
                  📷 Upload
                </label>
                {profilePhoto && (
                  <button
                    onClick={handleDeletePhoto}
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-sm font-medium"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Profile Fields */}
          <div className="space-y-5">
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone Number", key: "phone", type: "tel" },
              { label: "Address", key: "address", type: "textarea" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {isEditing ? (
                  field.type === "textarea" ? (
                    <textarea
                      value={editedProfile[field.key as keyof ProfileData]}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          [field.key]: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={editedProfile[field.key as keyof ProfileData]}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  )
                ) : (
                  <p className="text-gray-800 text-lg">
                    {profile[field.key as keyof ProfileData]}
                  </p>
                )}
              </div>
            ))}

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 px-6 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 px-6 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
