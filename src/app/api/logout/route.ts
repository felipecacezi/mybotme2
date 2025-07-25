
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Clear the cookies by setting them with a past expiration date
    cookieStore.set('auth_token', '', { httpOnly: true, path: '/', maxAge: -1 });
    cookieStore.set('company_id', '', { httpOnly: true, path: '/', maxAge: -1 });

    return NextResponse.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred during logout.' }, { status: 500 });
  }
}
