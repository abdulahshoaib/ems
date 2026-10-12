import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
        <Route path="/login" />
        <Route path="/register" />
        <Route path="/events" />
        <Route path="/events/:id" />
        <Route path="/my-events/:id" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
