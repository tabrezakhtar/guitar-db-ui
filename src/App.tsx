const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
          <div className="text-lg font-bold">Logo</div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-screen-xl mx-auto w-full">
        {/* Side Menu */}
        <aside className="bg-gray-100 w-full md:w-1/4 lg:w-1/5 p-4">
          <ul className="space-y-2">
            <li><a href="#" className="block p-2 hover:bg-gray-200">Dashboard</a></li>
            <li><a href="#" className="block p-2 hover:bg-gray-200">Settings</a></li>
            <li><a href="#" className="block p-2 hover:bg-gray-200">Profile</a></li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-4">
          <h1 className="text-2xl font-bold mb-4">Main Content</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={"https://picsum.photos/200"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full object-cover"
                />
                <div className="p-2">
                  <h2 className="text-lg font-semibold">Thumbnail {index + 1}</h2>
                  <p className="text-sm text-gray-600">Description for thumbnail {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
