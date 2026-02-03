// lib/api/admin.api.ts
// All admin API functions to talk to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get token from cookie
const getToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") {
      return value;
    }
  }
  return null;
};

// ✅ 1. CREATE USER
export const createUser = async (formData: FormData) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create user");
  }

  return data;
};

// ✅ 2. GET ALL USERS
export const getAllUsers = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

// ✅ 3. GET SINGLE USER BY ID
export const getUserById = async (id: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data;
};

// ✅ 4. UPDATE USER BY ID
export const updateUser = async (id: string, formData: FormData) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update user");
  }

  return data;
};

// ✅ 5. DELETE USER BY ID
export const deleteUser = async (id: string) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
  }

  return data;
};