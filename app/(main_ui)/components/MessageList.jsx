// app/(main UI)/components/MessageList.jsx
'use client';

export default function MessageList({ messages, currentUserId }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender.id === currentUserId ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${
              message.sender.id === currentUserId
                ? 'bg-indigo-500 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
            }`}
          >
            <p className="font-semibold text-sm mb-1">
              {message.sender.name}
            </p>
            <p>{message.content}</p>
            <span className={`text-xs mt-1 block ${message.sender.id === currentUserId ? 'text-indigo-200' : 'text-gray-500'}`}>
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}