import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-rose-50 px-4 md:px-10">
      {children}
    </section>
  );
}
