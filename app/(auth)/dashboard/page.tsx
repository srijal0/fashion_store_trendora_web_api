"use client";

import Link from "next/link";
import Image from "next/image";

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      {/* ================= Header ================= */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="text-2xl font-bold text-pink-600">Trendora</div>

        <nav className="flex gap-6 text-gray-700 font-medium">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/orders">Orders</Link>
        </nav>

        <div className="flex gap-4">
          <Link href="/profile" className="text-gray-700 hover:text-black">
            Profile
          </Link>
          <Link
            href="/logout"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-semibold"
          >
            Logout
          </Link>
        </div>
      </header>

      {/* ================= Main ================= */}
      <main className="p-8 w-full">
        {/* Welcome */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back to Trendora
          </h2>
          <p className="text-sm text-gray-600">
            Explore new arrivals, track your orders, and manage your account.
          </p>
        </section>

        {/* ================= Top Stats ================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full">
          <StatCard title="Orders Placed" value="12" />
          <StatCard title="Wishlist Items" value="5" />
          <StatCard title="Reward Points" value="240" />
        </section>

        {/* ================= Featured Products ================= */}
        <section className="mb-10 w-full">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Featured Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            <ProductCard name="American Boy T-Shirt" imagePath="/images/image1.png" />
            <ProductCard name="Classic Denim Jacket" imagePath="/images/image2.png" />
            <ProductCard name="Hoodie" imagePath="/images/image3.png" />
            <ProductCard name="Summer Dress" imagePath="/images/image4.png" />
          </div>
        </section>

        {/* ================= Recent Orders ================= */}
        <section className="w-full">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Orders
          </h3>
          <table className="w-full text-sm bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-pink-600 text-white">
              <tr>
                <th className="py-2 px-3 text-left">Order</th>
                <th className="px-3 text-left">Date</th>
                <th className="px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow order="#ORD-3001" date="Jan 28, 2026" status="Shipped" />
              <OrderRow order="#ORD-2998" date="Jan 25, 2026" status="Paid" />
              <OrderRow order="#ORD-2995" date="Jan 20, 2026" status="Pending" />
            </tbody>
          </table>
        </section>

        {/* ================= Bestseller ================= */}
        <section className="mt-10 w-full">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Bestselling Items
          </h3>
          <ul className="space-y-3 text-sm bg-white rounded-xl p-6 shadow">
            <li className="flex justify-between">
              <span>American Boy T-Shirt</span>
              <span className="text-gray-500">1,240</span>
            </li>
            <li className="flex justify-between">
              <span>Classic Denim Jacket</span>
              <span className="text-gray-500">980</span>
            </li>
            <li className="flex justify-between">
              <span>Hoodie</span>
              <span className="text-gray-500">860</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

/* ================= UI Components ================= */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-full">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-pink-600 mt-2">{value}</p>
    </div>
  );
}

function ProductCard({ name, imagePath }: { name: string; imagePath: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center w-full">
      {/* Image container with fixed height */}
      <div className="relative h-32 w-full mb-3">
        <Image
          src={imagePath}
          alt={name}
          fill
          className="object-cover rounded"
        />
      </div>
      <p className="text-sm font-medium text-gray-700">{name}</p>
      <button className="mt-2 text-xs bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700">
        View
      </button>
    </div>
  );
}

function OrderRow({
  order,
  date,
  status,
}: {
  order: string;
  date: string;
  status: "Paid" | "Shipped" | "Pending";
}) {
  const map = {
    Paid: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <tr className="border-b last:border-none text-gray-600">
      <td className="py-2 px-3">{order}</td>
      <td className="px-3">{date}</td>
      <td className="px-3">
        <span className={`text-xs px-2 py-1 rounded-full ${map[status]}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}
