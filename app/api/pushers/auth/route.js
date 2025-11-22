// app/api/auth/pusher/auth/route.js
import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

// MOCK data needed to authorize the presence channel
const MOCK_USER_ID = 'clt1234567890abcdefghijklm';
const MOCK_USER_INFO = {
    id: MOCK_USER_ID,
    user_info: {
        name: 'Mock User',
        email: 'mock@user.com'
    }
};

export async function POST(request) {
  try {
    const data = await request.formData();
    const socketId = data.get('socket_id');
    const channelName = data.get('channel_name');

    // In a real app: Verify the user is authenticated (e.g., check session or JWT)
    // const currentUserId = getSessionUser(request); 
    const currentUserId = MOCK_USER_ID; 
    
    if (!currentUserId) {
        return new NextResponse('Not authenticated', { status: 401 });
    }

    // 1. Authorize for Private Channel (presence-*)
    // We can use the mock user info here since we are mocking auth
    const authResponse = pusherServer.authorizeChannel(socketId, channelName, MOCK_USER_INFO.id, MOCK_USER_INFO.user_info);

    return NextResponse.json(authResponse);

  } catch (error) {
    console.error('Pusher Auth Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}