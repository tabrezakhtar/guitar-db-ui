import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About";
import Contact from "./Contact";
import Landing from "./Landing";
import Grid from "./guitars/Grid";
import EditGuitar from "./edit/EditGuitar";
import ViewGuitar from "./view/ViewGuitar";
import AddGuitar from "./AddGuitar";
import Profile from "./profile/Profile";
import EditProfile from "./profile/EditProfile";
import { UserProvider } from "./context/UserContext";
import { GuitarProvider } from "./context/GuitarContext";
import { TagProvider } from "./context/TagContext";
import Header from "./Header";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import SaveCredentials from "./SaveCredentials";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Router>
        <UserProvider>
          <GuitarProvider>
            <TagProvider>
              <Header />

              <div>
                <Routes>
                  <Route path="/" element={<Layout hideMenu><Landing /></Layout>} />
                  <Route path="/gallery" element={<Layout><Grid /></Layout>} />
                  <Route path="/about" element={<Layout><About /></Layout>} />
                  <Route path="/contact" element={<Layout><Contact /></Layout>} />
                  <Route
                    path="/edit/:id"
                    element={
                      <Layout>
                        <ProtectedRoute>
                          <EditGuitar />
                        </ProtectedRoute>
                      </Layout>
                    }
                  />
                  <Route path="/view/:id" element={<Layout><ViewGuitar /></Layout>} />
                  <Route
                    path="/add"
                    element={
                      <Layout>
                        <ProtectedRoute>
                          <AddGuitar />
                        </ProtectedRoute>
                      </Layout>
                    }
                  />
                  <Route path="/profile" element={<Layout><Profile /></Layout>} />
                  <Route path="/profile/:userId" element={<Layout><Profile /></Layout>} />
                  <Route
                    path="/edit-profile"
                    element={
                      <Layout>
                        <ProtectedRoute>
                          <EditProfile />
                        </ProtectedRoute>
                      </Layout>
                    }
                  />
                  <Route path="/auth" element={<SaveCredentials />} />
                </Routes>
              </div>
            </TagProvider>
          </GuitarProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
