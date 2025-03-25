import { useState } from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import Modal from "./Modal";
import GuitarsGrid from "./GuitarsGrid";
import About from "./About";
import Contact from "./Contact";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const someContent = (
    <div>
      <h1 className="text-2xl font-bold mb-4">Modal Content</h1>  
      <p>This is the content of the modal</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <BrowserRouter>
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 flex">
          <div className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
            <div className="text-lg font-bold pl-6">Guitar Explorer🔥</div>
            
              <nav className="pr-5">
                <ul className="flex space-x-4">
                  <li><Link to="/" className="hover:underline">Home</Link></li>
                  <li><Link to="/about" className="hover:underline">About</Link></li>
                  <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                </ul>
              </nav>
          </div>
        </header>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {someContent}
        </Modal>

        <Routes>
          <Route path="/" />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row max-w-screen-xl mx-auto w-full">
          {/* Side Menu */}
          <aside className="bg-gray-500 text-white w-full md:w-1/4 lg:w-1/5 p-4">
            {/* Shapes */}
            <div className="mt-4 justify-items-center">
              {/* First Row */}
              <div className="text-sm font-semibold mb-2">Select Shape</div>

              {/* Second Row */}
              <div className="flex space-x-2">
                <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
                  <span className="w-6 h-6">All</span>
                </button>
                <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
                  <img src="/shapes/singlecut_outline.png" alt="Icon" className="w-6 h-6" />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
                  <img src="/shapes/stype_outline.png" alt="Icon" className="w-6 h-6" />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
                  <img src="/shapes/ttype_outline.png" alt="Icon" className="w-6 h-6" />
                </button>
                <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
                  <img src="/shapes/v_outline.png" alt="Icon" className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Brand */}
            <div className="mt-4 justify-items-center">
              <div className="text-sm font-semibold mb-2">Brand</div>

              <div className="flex space-x-2 w-full">
                  <select title="brands" className="border rounded p-2 w-full">
                    <option value="fender">Fender</option>
                    <option value="gibson">Gibson</option>
                    <option value="ibanez">Ibanez</option>
                  </select>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white p-4">
            <GuitarsGrid />
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
