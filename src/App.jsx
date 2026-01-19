import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Grid from "./guitars/Grid";
import EditGuitar from "./edit/EditGuitar";
import ViewGuitar from "./view/ViewGuitar";
import AddGuitar from "./AddGuitar";
import Profile from "./profile/Profile";
import EditProfile from "./profile/EditProfile";
import PostPage from "./PostPage";
import { UserProvider } from "./context/UserContext";
import { GuitarProvider } from "./context/GuitarContext";
import { TagProvider } from "./context/TagContext";
import { HeaderProvider } from "./context/HeaderContext";
import Header from "./Header";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import SaveCredentials from "./SaveCredentials";
import ScrollToTop from "./components/ScrollToTop";
// import CookieAlert from "./components/CookieAlert";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Router>
        <ScrollToTop />
        <UserProvider>
          <GuitarProvider>
            <TagProvider>
              <HeaderProvider>
                <Header />

                <div>
                  <Routes>
                    <Route path="/" element={<Layout hideMenu><Landing /></Layout>} />
                    <Route path="/gallery" element={<Layout><Grid /></Layout>} />
                    <Route
                      path="/edit/:id"
                      element={
                        <Layout hideMenu>
                          <ProtectedRoute>
                            <EditGuitar />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route path="/view/:id" element={<Layout hideMenu><ViewGuitar /></Layout>} />
                    <Route path="/posts/:slug" element={<Layout hideMenu><PostPage /></Layout>} />
                    <Route
                      path="/add"
                      element={
                        <Layout hideMenu>
                          <ProtectedRoute>
                            <AddGuitar />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route path="/profile" element={<Layout hideMenu><Profile /></Layout>} />
                    <Route path="/profile/:userId" element={<Layout hideMenu><Profile /></Layout>} />
                    <Route
                      path="/edit-profile"
                      element={
                        <Layout hideMenu>
                          <ProtectedRoute>
                            <EditProfile />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route path="/auth" element={<SaveCredentials />} />
                  </Routes>
                  {/* <CookieAlert /> */}
                </div>
              </HeaderProvider>
            </TagProvider>
          </GuitarProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
