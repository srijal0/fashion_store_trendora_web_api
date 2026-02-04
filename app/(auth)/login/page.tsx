"use client";

import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Main Card Container */}
      <main className="flex w-full max-w-5xl h-[70vh] rounded-2xl bg-white shadow-2xl overflow-hidden">
        
        {/* Left Branding Section */}
        <div className="hidden md:flex w-1/2 bg-red-600 items-center justify-center">
          {/* 👇 Full red background with logo centered */}
          <img
            src="/images/image5.png"   // place your logo in public/images/image5.png
            alt="TrendDora Logo"
            className="max-w-full max-h-full object-contain outline-none focus:outline-none border-none"
          />
        </div>

        {/* Right Form Section */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-12">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
