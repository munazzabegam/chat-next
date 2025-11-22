// app/api/messages/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

// MOCK sender ID required for the demo to work (Must match ID seeded in DB)
const MOCK_SENDER_ID = 'clt1234567890abcdefghijklm'; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { groupId, content } = body;

    if (!groupId || !content) {
      return new NextResponse('Missing groupId or content', { status: 400 });
    }
    
    const senderId = MOCK_SENDER_ID; 

    // 1. Create the message in the database
    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId,
        groupId,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    
    // 2. Trigger a real-time event via Pusher
    const channelName = `presence-chat-group-${groupId}`;
    await pusherServer.trigger(channelName, 'new_message', newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Send Message Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}