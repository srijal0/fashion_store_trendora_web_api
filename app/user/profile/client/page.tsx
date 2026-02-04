'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '../_components/ProfileForm';

export default function ProfileClientPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        // This is a Next.js API route (app/api/user/me/route.ts)
        // It reads the user_data cookie server-side — no base URL needed
        const response = await fetch('/api/user/me');

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        if (!cancelled) setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        if (!cancelled) router.push('/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <ProfileForm
        userId={user.id || user._id}
        initialData={{
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || user.username,
          email: user.email,
          bio: user.bio,
          phone: user.phone,
          image: user.image || user.profileImage,
        }}
      />
    </div>
  );
}

