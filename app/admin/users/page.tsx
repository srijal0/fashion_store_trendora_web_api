"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllUsers, deleteUser } from "@/lib/api/admin.api";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Pagination and search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");

  // Fetch users whenever page changes
  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(page, 10); // page + limit sent

      setUsers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalUsers(data.pagination?.totalUsers || 0);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      setDeleteId(null);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Total Users: {totalUsers}</p>
          </div>
          <Link
            href="/admin/users/create"
            className="px-4 py-2 bg-pink-400 text-white text-sm font-semibold rounded-md hover:bg-pink-500 transition-colors"
          >
            + Create User
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* User Table */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-pink-50 border-b border-pink-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Username</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-pink-100 flex items-center justify-center">
                            {user.profileImage ? (
                              <img
                                src={
                                  user.profileImage.includes("localhost") ||
                                  user.profileImage.startsWith("/uploads")
                                    ? `/api/image-proxy?url=${encodeURIComponent(
                                        `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profileImage}`
                                      )}`
                                    : user.profileImage
                                }
                                alt={user.firstName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-pink-600">
                                {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : "No Name"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="px-3 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-md hover:bg-pink-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(user.id)}
                          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4 px-4 py-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Prev
            </button>
            <span className="px-2 py-2">{page}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete User</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
