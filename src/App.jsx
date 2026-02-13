import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
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

const Landing = lazy(() => import("./landing/Landing"));
const EditGuitar = lazy(() => import("./edit/EditGuitar"));
const ViewGuitar = lazy(() => import("./view/ViewGuitar"));
const AddGuitar = lazy(() => import("./AddGuitar"));
const Profile = lazy(() => import("./profile/Profile"));
const EditProfile = lazy(() => import("./profile/EditProfile"));
const PostPage = lazy(() => import("./PostPage"));
const Followers = lazy(() => import("./follow/Followers"));
const Following = lazy(() => import("./follow/Following"));
const SaveCredentials = lazy(() => import("./SaveCredentials"));
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
                  <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spinner /></div>}>
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
                      <Route path="/auth" element={<SaveCredentials />} />
                      <Route path="/followers" element={<Layout hideSideMenu><Followers /></Layout>} />
                      <Route path="/followers/:userId" element={<Layout hideSideMenu><Followers /></Layout>} />
                      <Route path="/following" element={<Layout hideSideMenu><Following /></Layout>} />
                      <Route path="/following/:userId" element={<Layout hideSideMenu><Following /></Layout>} />
                    </Routes>
                  </Suspense>
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
