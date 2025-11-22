// app/(main UI)/components/ChatLayout.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import PusherClient from 'pusher-js';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput'; 

// **MOCK DATA** - Must match seeded data for connectivity
const MOCK_GROUP_ID = 'grp_temp_123';
const MOCK_GROUP_NAME = 'Temporary Live Chat';
const MOCK_USER = { id: 'clt1234567890abcdefghijklm', name: 'Mock User' };
// **---**

export default function ChatLayout() {
  const [messages, setMessages] = useState([]);
  const [groupId, setGroupId] = useState(MOCK_GROUP_ID);
  
  // Use useCallback to memoize the handleSendMessage function
  const handleSendMessage = useCallback(async (content) => {
    if (!content || !groupId) return;

    // Optimistically update the UI
    const mockMessage = {
        id: Date.now().toString(),
        content,
        sender: MOCK_USER,
        createdAt: new Date(),
        groupId,
    };
    setMessages((prevMessages) => [...prevMessages, mockMessage]);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, content }),
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Rollback optimistic update on failure
      setMessages((prevMessages) => prevMessages.filter(m => m.id !== mockMessage.id)); 
    }
  }, [groupId]); 

  // Effect to handle Pusher subscription
  useEffect(() => {
    if (!groupId || !process.env.NEXT_PUBLIC_PUSHER_APP_KEY) return;

    // 1. Initialize Pusher Client
    const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      // 2. Use the Pusher Auth API route for security
      authEndpoint: '/api/auth/pusher/auth', 
      auth: {
        params: {
          // Pass any mock data needed by the backend auth
          userId: MOCK_USER.id, 
        }
      }
    });

    const channelName = `presence-chat-group-${groupId}`;
    const channel = pusherClient.subscribe(channelName);

    // 3. Bind to the 'new_message' event
    channel.bind('new_message', (message) => {
      // Pusher provides the final, persisted message; ensure we don't duplicate 
      // if the optimistic update has the same temporary ID (this depends on your rollback logic)
      setMessages((prevMessages) => {
        // Simple deduplication check based on content/sender (optional)
        if (prevMessages.some(m => m.id === message.id)) return prevMessages;
        return [...prevMessages.filter(m => m.id !== message.id), message]; // Filter out temp, add final
      });
    });

    console.log(`Subscribing to channel: ${channelName}`);
    
    // 4. Cleanup function
    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.disconnect();
    };
  }, [groupId]); // Re-run effect when groupId changes

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar 
        currentGroup={{ id: MOCK_GROUP_ID, name: MOCK_GROUP_NAME }}
        onGroupSelect={setGroupId} 
      />
      
      <div className="flex flex-col flex-1">
        <header className="bg-white p-4 shadow-md">
          <h2 className="text-lg font-semibold">{MOCK_GROUP_NAME}</h2>
        </header>

        <MessageList messages={messages} currentUserId={MOCK_USER.id} />
        
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}