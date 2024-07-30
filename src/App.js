import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import NavBar from "./components/common/NavBar";
import CategoriesView from "./components/admin/CategoriesView";
import Home from "./components/admin/Home";
import AddCategory from "./components/admin/AddCategory";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/view-categories" element={<CategoriesView />} />
          <Route exact path="/add-categories" element={<AddCategory />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
