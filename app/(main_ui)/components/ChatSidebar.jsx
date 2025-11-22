// app/(main UI)/components/ChatSidebar.jsx
'use client';

const mockGroups = [
  { id: 'grp_temp_123', name: 'Temporary Live Chat' },
  // Add other mock groups here
];

export default function ChatSidebar({ currentGroup, onGroupSelect }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      <h3 className="text-xl font-bold mb-6 text-indigo-600">Chat Groups</h3>
      <nav>
        {mockGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => onGroupSelect(group.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
              currentGroup.id === group.id
                ? 'bg-indigo-500 text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            {group.name}
          </div>
        ))}
      </nav>
    </div>
  );
}