import { NextResponse } from 'next/server';
import { getUserData, getAuthToken } from '@/lib/cookie';

export async function GET() {
  try {
    console.log('=== API /user/me called ===');
    
    // Check if auth token exists
    const authToken = await getAuthToken();
    console.log('Auth token exists:', !!authToken);
    
    // Get user data from cookie
    const userData = await getUserData();
    console.log('User data from cookie:', userData);
    
    if (!userData) {
      console.log('No user data found in cookies - not authenticated');
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('Returning user data:', userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error in /api/user/me:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get user data', error: String(error) },
      { status: 500 }
    );
  }
}