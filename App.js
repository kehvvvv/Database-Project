import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import SignUpMenu from "./pages/SignUpMenu";
import LoginMenu from "./pages/LoginMenu.js";
import MainMenu from "./pages/MainMenu.js";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpMenu />} />
        <Route path="/login" element={<LoginMenu />} />
        <Route path="/main/:username" element={<MainMenu />} />
      </Routes>
    </Router>
  );
}

export default App;