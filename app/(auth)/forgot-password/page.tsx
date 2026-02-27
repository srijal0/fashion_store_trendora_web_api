import ForgotPasswordForm from "../_components/ForgotPasswordForm";


export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl shadow-lg rounded-xl overflow-hidden">
        {/* Left Red Panel */}
        <div className="hidden md:flex w-1/2 bg-red-600 items-center justify-center">
          <h1 className="text-white text-4xl font-bold">TrendDora</h1>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Enter your email below and we'll send you a reset link.
          </p>

          <div className="mt-6">
            <ForgotPasswordForm />
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="font-semibold text-pink-500 hover:underline"
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
