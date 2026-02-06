import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token');
  const userDataCookie = cookieStore.get('user_data');
  
  if (!authToken || !userDataCookie) {
    redirect('/login');
  }

  let userData = null;
  try {
    userData = JSON.parse(userDataCookie.value);
    if (userData.role !== 'admin') {
      redirect('/dashboard');
    }
  } catch (error) {
    console.error("User data parse error:", error);
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">👗</span>
              <div>
                <h1 className="text-2xl font-bold text-pink-600">Trendora</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <span className="text-gray-600">{userData?.email}</span>
              <Link
                href="/login"
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
              >
                Logout
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-400 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {userData?.name || userData?.email || "Admin"}! 👋
          </h2>
          <p className="text-pink-100">
            Manage your Trendora fashion store from here
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">248</p>
              </div>
              <div className="text-5xl">🛒</div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">156</p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-3xl font-bold text-gray-800">$12.5k</p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          {/* Create User */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Create User</p>
                <p className="text-3xl font-bold text-gray-800">+ New</p>
              </div>
              <div className="text-5xl">➕</div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Users */}
          <Link href="/admin/users">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Manage Users
              </h3>
              <p className="text-gray-600 mb-4">
                View and manage all registered users
              </p>
              <div className="text-pink-500 font-medium">View Users →</div>
            </div>
          </Link>

          {/* Create User */}
          <Link href="/admin/create-user">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">➕</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Create User
              </h3>
              <p className="text-gray-600 mb-4">
                Add a new user account
              </p>
              <div className="text-pink-500 font-medium">Add User →</div>
            </div>
          </Link>

          {/* Manage Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Orders
            </h3>
            <p className="text-gray-600 mb-4">
              Track and manage all customer orders
            </p>
            <div className="text-pink-500 font-medium">View Orders →</div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 mb-4">
              View sales reports and performance statistics
            </p>
            <div className="text-pink-500 font-medium">View Analytics →</div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Settings
            </h3>
            <p className="text-gray-600 mb-4">
              Configure Trendora system settings
            </p>
            <div className="text-pink-500 font-medium">Open Settings →</div>
          </div>
        </div>
      </main>
    </div>
  );
}
