// src/components/Sidebar.jsx
export default function Sidebar() {
    return (
      <div className="w-64 bg-gray-900 text-white h-screen p-4">
        <h2 className="text-xl font-semibold mb-6">FoundryBot</h2>
        <ul className="space-y-3">
          <li className="hover:text-blue-400 cursor-pointer">New Project</li>
          <li className="hover:text-blue-400 cursor-pointer">Prompt Library</li>
          <li className="hover:text-blue-400 cursor-pointer">Settings</li>
        </ul>
      </div>
    );
  }
  