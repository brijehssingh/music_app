import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import Album from "./pages/Album";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import MySongs from "./pages/MySongs";
import NotFound from "./pages/NotFound";
import Player from "./pages/Player";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import { useAuthStore } from "./store/authStore";

function AppContent() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="app-shell min-h-screen pb-28 text-white">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/mysongs" element={<MySongs />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/player" element={<Player />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <MusicPlayer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
