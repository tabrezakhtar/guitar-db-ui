import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { GuitarProvider } from "./context/GuitarContext";
import { TagProvider } from "./context/TagContext";
import { HeaderProvider } from "./context/HeaderContext";
import Header from "./Header";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Spinner from "./components/Spinner";
import Grid from "./guitars/Grid";
import Landing from "./landing/Landing";
import EditGuitar from "./edit/EditGuitar";
import ViewGuitar from "./view/ViewGuitar";
import AddGuitar from "./AddGuitar";
import Profile from "./profile/Profile";
import EditProfile from "./profile/EditProfile";
import EditSchedule from "./schedule/EditSchedule";
import PostPage from "./PostPage";
import Followers from "./follow/Followers";
import Following from "./follow/Following";
import SaveCredentials from "./SaveCredentials";
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
                    <Route path="/" element={<Layout hideSideMenu hideGuestWarning><Landing /></Layout>} />
                      <Route path="/gallery" element={<Layout hideFooter><Grid /></Layout>} />
                      <Route
                        path="/edit/:id"
                        element={
                          <Layout hideSideMenu>
                            <ProtectedRoute>
                              <EditGuitar />
                            </ProtectedRoute>
                          </Layout>
                        }
                      />
                      <Route path="/view/:id" element={<Layout hideSideMenu><ViewGuitar /></Layout>} />
                      <Route path="/posts/:slug" element={<Layout hideSideMenu hideGuestWarning><PostPage /></Layout>} />
                      <Route
                        path="/add"
                        element={
                          <Layout hideSideMenu>
                            <ProtectedRoute>
                              <AddGuitar />
                            </ProtectedRoute>
                          </Layout>
                        }
                      />
                      <Route path="/profile" element={<Layout hideSideMenu><Profile /></Layout>} />
                      <Route path="/profile/:userId" element={<Layout hideSideMenu><Profile /></Layout>} />
                      <Route
                        path="/edit-profile"
                        element={
                          <Layout hideSideMenu>
                            <ProtectedRoute>
                              <EditProfile />
                            </ProtectedRoute>
                          </Layout>
                        }
                      />
                      <Route
                        path="/edit-schedule"
                        element={
                          <Layout hideSideMenu>
                            <ProtectedRoute>
                              <EditSchedule />
                            </ProtectedRoute>
                          </Layout>
                        }
                      />
                      <Route path="/auth" element={<SaveCredentials />} />
                      <Route path="/followers" element={<Layout hideSideMenu><Followers /></Layout>} />
                      <Route path="/followers/:userId" element={<Layout hideSideMenu><Followers /></Layout>} />
                      <Route path="/following" element={<Layout hideSideMenu><Following /></Layout>} />
                      <Route path="/following/:userId" element={<Layout hideSideMenu><Following /></Layout>} />
                    </Routes>
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
