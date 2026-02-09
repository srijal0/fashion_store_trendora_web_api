// "use client";
// import { useState } from "react";

// export default function ProfilePage() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profile, setProfile] = useState({
//     name: "Anna Petrova",
//     email: "anna.petrova@example.com",
//     phone: "+7 (999) 123-45-67",
//     address: "Moscow, Sadovaya st., 15, apt. 42",
//   });
//   const [editedProfile, setEditedProfile] = useState(profile);

//   const handleSave = () => {
//     setProfile(editedProfile);
//     setIsEditing(false);
//     alert("Profile updated!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Personal Info */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl p-8 border border-pink-100 shadow-sm">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
//               {!isEditing && (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="px-6 py-2 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition"
//                 >
//                   ✏️ Edit
//                 </button>
//               )}
//             </div>
//             <div className="space-y-6">
//               {/* Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     value={editedProfile.name}
//                     onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
//                     className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
//                   />
//                 ) : (
//                   <p className="text-gray-800 text-lg">{profile.name}</p>
//                 )}
//               </div>
//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                 {isEditing ? (
//                   <input
//                     type="email"
//                     value={editedProfile.email}
//                     onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
//                     className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
//                   />
//                 ) : (
//                   <p className="text-gray-800 text-lg">{profile.email}</p>
//                 )}
//               </div>
//               {/* Phone */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                 {isEditing ? (
//                   <input
//                     type="tel"
//                     value={editedProfile.phone}
//                     onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
//                     className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
//                   />
//                 ) : (
//                   <p className="text-gray-800 text-lg">{profile.phone}</p>
//                 )}
//               </div>
//               {/* Address */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                 {isEditing ? (
//                   <textarea
//                     value={editedProfile.address}
//                     onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
//                   />
//                 ) : (
//                   <p className="text-gray-800 text-lg">{profile.address}</p>
//                 )}
//               </div>
//               {/* Save / Cancel */}
//               {isEditing && (
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={handleSave}
//                     className="flex-1 py-3 px-6 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition font-semibold"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditedProfile(profile);
//                       setIsEditing(false);
//                     }}
//                     className="flex-1 py-3 px-6 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition font-medium"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Account Stats */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl p-6 border border-pink-100 shadow-sm">
//             <h3 className="font-bold text-gray-800 mb-4">Account Stats</h3>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Total Orders</span>
//                 <span className="font-bold text-pink-500 text-xl">12</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Favorites</span>
//                 <span className="font-bold text-pink-500 text-xl">8</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Points</span>
//                 <span className="font-bold text-pink-500 text-xl">450</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useRef, ChangeEvent } from "react";

/* read auth token from cookie */
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("auth_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default function ProfilePage() {
  const userId = "YOUR_USER_ID"; // 🔴 replace with real user id

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Anna Petrova",
    email: "anna.petrova@example.com",
    phone: "+7 (999) 123-45-67",
    address: "Moscow, Sadovaya st., 15, apt. 42",
    image: "",
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* image select */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setSelectedFile(file);
    setEditedProfile({
      ...editedProfile,
      image: URL.createObjectURL(file),
    });
  };

  /* save profile */
  const handleSave = async () => {
    const token = getTokenFromCookie();
    if (!token) {
      alert("Session expired");
      return;
    }

    const nameParts = editedProfile.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", editedProfile.email);
    formData.append("phone", editedProfile.phone);
    formData.append("address", editedProfile.address);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setProfile({
        ...editedProfile,
        image: result.user.profileImage || editedProfile.image,
      });

      setIsEditing(false);
      setSelectedFile(null);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PERSONAL INFO */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-8 border border-pink-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50"
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            {/* PROFILE IMAGE */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border">
                {editedProfile.image ? (
                  <img
                    src={editedProfile.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold text-xl">
                    {profile.name[0]}
                  </div>
                )}
              </div>

              {isEditing && (
                <>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50"
                  >
                    Change Photo
                  </button>
                </>
              )}
            </div>

            {/* FIELDS */}
            <div className="space-y-6">
              {[
                ["Full Name", "name"],
                ["Email", "email"],
                ["Phone Number", "phone"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  {isEditing ? (
                    <input
                      value={(editedProfile as any)[key]}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300"
                    />
                  ) : (
                    <p className="text-lg">{(profile as any)[key]}</p>
                  )}
                </div>
              ))}

              {/* ADDRESS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedProfile.address}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300"
                  />
                ) : (
                  <p className="text-lg">{profile.address}</p>
                )}
              </div>

              {/* ACTIONS */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditedProfile(profile);
                      setIsEditing(false);
                      setSelectedFile(null);
                    }}
                    className="flex-1 py-3 border border-pink-300 text-pink-600 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-pink-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Orders</span>
                <span className="font-bold text-pink-500">12</span>
              </div>
              <div className="flex justify-between">
                <span>Favorites</span>
                <span className="font-bold text-pink-500">8</span>
              </div>
              <div className="flex justify-between">
                <span>Points</span>
                <span className="font-bold text-pink-500">450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

