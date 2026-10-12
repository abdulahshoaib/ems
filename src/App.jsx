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

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/components" element={<Components />} />
          <Route path="/login" />
          <Route path="/register" />
          <Route path="/events" />
          <Route path="/events/:id" />
          <Route path="/my-events/:id" />

          {/* Authenticated dashboard. Wrap this route with the auth guard from
              feat/auth once protected routes exist. */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="discover" element={<DiscoverEvents />} />
            <Route path="my-events" element={<MyEvents />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
