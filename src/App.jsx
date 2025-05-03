import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About";
import Contact from "./Contact";
import ContentContainer from "./ContentContainer";
import EditGuitar from "./edit/EditGuitar";
import ViewGuitar from "./view/ViewGuitar";
import AddGuitar from "./AddGuitar";
import Profile from "./profile/Profile";
import CreateProfile from "./profile/CreateProfile";
import EditProfile from "./profile/EditProfile";
import { UserProvider } from "./context/UserContext";
import { GuitarProvider } from "./context/GuitarContext";
import Header from "./Header";
import MagicLogin from "./MagicLogin";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Router>
        <GuitarProvider>
          <UserProvider>
            <Header />

            <div>
              <Routes>
                <Route path="/" element={<ContentContainer />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/edit/:id" element={<EditGuitar />} />
                <Route path="/view/:id" element={<ViewGuitar />} />
                <Route path="/add" element={<AddGuitar />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/login/magic" element={<MagicLogin />} />
              </Routes>
            </div>
          </UserProvider>
        </GuitarProvider>
      </Router>
    </div>
  );
}

export default App;
