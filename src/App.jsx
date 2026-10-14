import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ui";
import Landing from "./pages/Landing.jsx";
import Components from "./pages/Components.jsx";
import { DashboardLayout } from "./components/ui/dashboard-layout";
import { Overview } from "./pages/dashboard/Overview";
import { DiscoverEvents } from "./pages/dashboard/DiscoverEvents";
import { MyEvents } from "./pages/dashboard/MyEvents";
import { Profile } from "./pages/dashboard/Profile";
import { Settings } from "./pages/dashboard/Settings";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/protected-route.jsx";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/components" element={<Components />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" />
          <Route path="/events/:id" />
          <Route path="/my-events/:id" />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="discover" element={<DiscoverEvents />} />
              <Route path="my-events" element={<MyEvents />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
