import { Routes, Route } from "react-router-dom";
import Results from "./pages/Results";
import Home from "./pages/Home";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<Results />} />
    </Routes>
  );
}

export default App;