import { Link, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About";
import Contact from "./Contact";
import ContentContainer from "./ContentContainer";
import EditGuitar from "./edit/EditGuitar";
import ViewGuitar from "./view/ViewGuitar";
import AddGuitar from "./AddGuitar";
import Profile from "./profile/Profile";
import { UserProvider } from "./context/UserContext";
import { GuitarProvider } from "./context/GuitarContext";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Router>
        <GuitarProvider>
          <UserProvider>
            <header className="bg-gray-800 text-white p-4 flex">
              <div className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
                <div className="flex items-center pl-6">
                  <Link to="/" className="text-lg font-bold hover:underline">Guitar Explorer</Link>
                  <span>🔥</span>
                </div>
                
                <nav className="pr-5">
                  <ul className="flex space-x-4">
                    <li><Link to="/" className="hover:underline">Home</Link></li>
                    <li><Link to="/profile" className="hover:underline">Profile</Link></li>
                    <li><Link to="/login" className="hover:underline">Login</Link></li>
                    <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                    <li><Link to="/about" className="hover:underline">About</Link></li>
                  </ul>
                </nav>
              </div>
            </header>

            <Routes>
              <Route path="/" element={<ContentContainer />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/edit/:id" element={<EditGuitar />} />
              <Route path="/view/:id" element={<ViewGuitar />} />
              <Route path="/add" element={<AddGuitar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
            </Routes>
          </UserProvider>
        </GuitarProvider>
      </Router>
    </div>
  );
}

export default App;
