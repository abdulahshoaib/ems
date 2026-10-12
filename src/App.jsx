import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ui";
import Landing from "./pages/Landing.jsx";
import Components from "./pages/Components.jsx";

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
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
