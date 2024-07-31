import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import NavBar from "./components/admin/NavBar.js";
import SystemCategoriesView from "./components/admin/View_System.js";
import UserCategoriesView from "./components/admin/View_User.js";
import Home from "./components/admin/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Add from "./components/admin/Add";
import Edit from "./components/admin/Edit.js";
import View_Transactions from "./components/admin/View_Transactions.js";
import Transaction_Detail from "./components/admin/Transaction_Detail.js";
import View_All_Transactions from "./components/admin/View_All_Transactions.js";
import Login from "./components/common/Login.js";
import PrivacyPolicy from "./components/common/Policy.js";
import Register from "./components/common/Register";

function AppContent() {
  const location = useLocation();
  const hideNavBar =
    location.pathname === "/login" ||
    location.pathname === "/privacy-policy" ||
    location.pathname === "/register";

  return (
    <main className="container mt-5">
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route
          exact
          path="/view-categories-system"
          element={<SystemCategoriesView />}
        />
        <Route
          exact
          path="/view-categories-user"
          element={<UserCategoriesView />}
        />
        <Route exact path="/add-category" element={<Add />} />
        <Route exact path="/edit-category/:id" element={<Edit />} />
        <Route
          exact
          path="/transaction-description/:id"
          element={<Transaction_Detail />}
        />
        <Route
          exact
          path="/category-transaction/:id"
          element={<View_Transactions />}
        />
        <Route exact path="/transactions" element={<View_All_Transactions />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
