import ResetPasswordForm from "../../_components/ResetPasswordForm";


// ✅ FIXED: Make params async (Next.js 15+ requirement)
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  // ✅ Await the params
  const { token } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}