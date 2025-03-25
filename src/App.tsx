import { useState } from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import Modal from "./Modal";
import About from "./About";
import Contact from "./Contact";
import ContentContainer from "./ContentContainer";

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
          <Route path="/" element={<ContentContainer />}/>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
