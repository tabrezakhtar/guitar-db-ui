import { useState } from "react";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">Logo</div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </nav>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="bg-gray-100 w-full md:w-1/4 lg:w-1/5 p-4">
          <ul className="space-y-2">
            <li><a href="#" className="block p-2 hover:bg-gray-200">Dashboard</a></li>
            <li><a href="#" className="block p-2 hover:bg-gray-200">Settings</a></li>
            <li><a href="#" className="block p-2 hover:bg-gray-200">Profile</a></li>
          </ul>
        </aside>

        <main className="flex-1 bg-white p-4">
          <h1 className="text-2xl font-bold mb-4">Main Content</h1>
          <p>Welcome to the main content area.</p>
        </main>
      </div>
    </div>
  );
}

export default App;
