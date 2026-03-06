import { Routes, Route } from "react-router-dom";
import Results from "./pages/Results";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Loading from "./pages/Loading";


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/result" element={<Results />} />
      </Routes>
    </Layout>
  );
}

export default App;