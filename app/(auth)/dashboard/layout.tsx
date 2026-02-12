import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Providers from "./provider";
import DashboardNav from "./DashboardNav";


function decodeToken(token: string | undefined) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const decoded = decodeToken(token);

  if (!decoded) {
    redirect("/login");
  }

  if (decoded.role === "admin") {
    redirect("/admin/dashboard");
  }

  return (
    <Providers>
      <div className="min-h-screen">
        <DashboardNav user={decoded} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </Providers>
  );
}