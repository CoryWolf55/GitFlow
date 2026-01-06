import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/GitLoginPage";
import Dashboard from "./pages/Dashboard";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUppage />} />
      </Routes>
    </Router>
  );
}

export default App;
