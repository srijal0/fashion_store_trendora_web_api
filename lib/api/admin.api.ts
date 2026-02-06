// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// // Helper function to get token from cookie
// const getToken = (): string | null => {
//   if (typeof document === "undefined") return null;
//   const cookies = document.cookie.split(";");
//   for (const cookie of cookies) {
//     const [name, value] = cookie.trim().split("=");
//     if (name === "token") {
//       return value;
//     }
//   }
//   return null;
// };

// // Utility: safely parse JSON or throw with text
// const safeJson = async (response: Response) => {
//   const text = await response.text();
//   try {
//     return JSON.parse(text);
//   } catch {
//     throw new Error(`Invalid JSON response: ${text.slice(0, 100)}`);
//   }
// };

// // ✅ 1. CREATE USER
// export const createUser = async (formData: FormData) => {
//   const token = getToken();

//   const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//     body: formData,
//   });

//   const data = await safeJson(response);

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to create user");
//   }
//   return data;
// };

// // ✅ 2. GET ALL USERS
// export const getAllUsers = async () => {
//   const token = getToken();

//   const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await safeJson(response);

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to fetch users");
//   }
//   return data;
// };

// // ✅ 3. GET SINGLE USER BY ID
// export const getUserById = async (id: string) => {
//   const token = getToken();

//   const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await safeJson(response);

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to fetch user");
//   }
//   return data;
// };

// // ✅ 4. UPDATE USER BY ID
// export const updateUser = async (id: string, formData: FormData) => {
//   const token = getToken();

//   const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
//     method: "PUT",
//     headers: { Authorization: `Bearer ${token}` },
//     body: formData,
//   });

//   const data = await safeJson(response);

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to update user");
//   }
//   return data;
// };

// // ✅ 5. DELETE USER BY ID
// export const deleteUser = async (id: string) => {
//   const token = getToken();

//   const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await safeJson(response);

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to delete user");
//   }
//   return data;
// };




// lib/api/admin.api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Helper function to get token from cookie - UPDATED VERSION
const getToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    const value = rest.join("=");

    if (name === "auth_token") {
      // Decode and clean the token
      let token = decodeURIComponent(value);
      
      // Remove any quotes that might be wrapping the token
      token = token.replace(/^["']|["']$/g, '');
      
      console.log('Token found:', token.substring(0, 50) + '...');
      return token;
    }
  }

  console.log('No auth_token cookie found');
  return null;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data;
  } else {
    const text = await response.text();
    console.error("Received non-JSON response:", text.substring(0, 200));
    throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
  }
};

// ✅ 1. CREATE USER
export const createUser = async (formData: FormData) => {
  const token = getToken();
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }

  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Creating user at:', `${API_BASE_URL}/api/admin/users`);

  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
};

// ✅ 2. GET ALL USERS
export const getAllUsers = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// ✅ 3. GET SINGLE USER BY ID
export const getUserById = async (id: string) => {
  const token = getToken();
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// ✅ 4. UPDATE USER BY ID
export const updateUser = async (id: string, formData: FormData) => {
  const token = getToken();
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
};

// ✅ 5. DELETE USER BY ID
export const deleteUser = async (id: string) => {
  const token = getToken();
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};