// app/page.jsx

// 1. **Change the import statement** to include the (main_ui) directory.
import ChatLayout from './(main_ui)/components/ChatLayout'; 

// Server Component entry point
export default function ChatPage() {
  return (
    // ChatLayout will now be found in the correct directory
    <ChatLayout />
  );
}