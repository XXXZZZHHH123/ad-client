import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import NavBar from "./components/admin/NavBar.js";
import CategoriesView from "./components/admin/View.js";
import Home from "./components/admin/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Add from "./components/admin/Add";
import Edit from "./components/admin/Edit.js";

function App() {
  return (
    <main className="container mt-5">
      <Router>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/view-categories" element={<CategoriesView />} />
          <Route exact path="/add-category" element={<Add />} />
          <Route exact path="/edit-category/:id" element={<Edit />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
