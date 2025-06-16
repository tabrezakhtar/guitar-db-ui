import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About";
import Contact from "./Contact";
import ContentContainer from "./ContentContainer";
import EditGuitar from "./edit/EditGuitar";
import ViewGuitar from "./view/ViewGuitar";
import AddGuitar from "./AddGuitar";
import Profile from "./profile/Profile";
import EditProfile from "./profile/EditProfile";
import { UserProvider } from "./context/UserContext";
import { GuitarProvider } from "./context/GuitarContext";
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";
import SaveCredentials from "./SaveCredentials";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Router>
        <UserProvider>
          <GuitarProvider>
            <Header />

            <div>
              <Routes>
                <Route path="/" element={<ContentContainer />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route 
                  path="/edit/:id" 
                  element={
                    <ProtectedRoute>
                      <EditGuitar />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/view/:id" element={<ViewGuitar />} />
                <Route 
                  path="/add" 
                  element={
                    <ProtectedRoute>
                      <AddGuitar />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route 
                  path="/edit-profile" 
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  } 
                />
                {/* <Route path="/login/magic" element={<MagicLogin />} /> */}
                <Route path="/auth" element={<SaveCredentials />} />
              </Routes>
            </div>
          </GuitarProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
