"use client";

import React from "react";
import Link from "next/link";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b">
        {/* Logo */}
        <div className="text-2xl font-bold text-pink-600">TrendDora</div>

        {/* Navigation */}
        <nav className="flex gap-6 text-gray-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Auth Links */}
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:text-black">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded font-semibold"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-16">
        {/* Left Content */}
        <div className="max-w-lg mb-12 md:mb-0">
          <h1 className="text-5xl font-bold mb-6">Building a update you</h1>
          <p className="text-lg text-gray-600 mb-8">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard.
          </p>
          <Link
            href="/get-started"
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded text-white font-semibold inline-block"
          >
            Get Started
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative">
          <img
            src="/images/image.png" // replace with your actual asset
            alt="Landing Visual"
            className="w-[400px] h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default Page;
