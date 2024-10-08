import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./components/admin/Home";
import BudgetSet from "./components/user/BudgetSet";
import NavBar from "./components/user/NavBar";
import AdminNavBar from "./components/admin/NavBar";
import SystemCategoriesView from "./components/admin/View_System";
import UserCategoriesView from "./components/admin/View_User";
import Add from "./components/admin/Add";
import Edit from "./components/admin/Edit";
import View_Transactions from "./components/admin/View_Transactions";
import Transaction_Detail from "./components/admin/Transaction_Detail";
import View_All_Transactions from "./components/admin/View_All_Transactions";
import View_All from "./components/admin/View_All";
import View_accounts from "./components/admin/View_accounts";
import Edit_User from "./components/admin/Edit_User";
import User_Transaction from "./components/admin/User_Transaction";
import Login from "./components/common/Login";
import PrivacyPolicy from "./components/common/Policy";
import Register from "./components/common/Register";
import Dashboard from "./components/user/Dashboard";
import Transaction from "./components/user/Transaction";
import PrivateRoute from "./components/PrivateRoute";

const AppContent = () => {
  const location = useLocation();
  const hideNavBarPaths = ["/login", "/privacy-policy", "/register"];

  const hideNavBar = hideNavBarPaths.includes(location.pathname);

  return (
    <main className="container-fluid">
      {!hideNavBar && location.pathname.startsWith("/admin") && <AdminNavBar />}
      {!hideNavBar && location.pathname.startsWith("/user") && <NavBar />}
      <div className="site-layout-content" style={{ margin: "16px 0" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin/view-categories_all"
            element={<PrivateRoute element={<View_All />} />}
          />
          <Route
            path="/admin/view-categories-system"
            element={<PrivateRoute element={<SystemCategoriesView />} />}
          />
          <Route
            path="/admin/view-categories-user"
            element={<PrivateRoute element={<UserCategoriesView />} />}
          />
          <Route
            path="/admin/add-category"
            element={<PrivateRoute element={<Add />} />}
          />
          <Route
            path="/admin/edit-category/:id"
            element={<PrivateRoute element={<Edit />} />}
          />
          <Route
            path="/admin/transaction-description/:id"
            element={<PrivateRoute element={<Transaction_Detail />} />}
          />
          <Route
            path="/admin/category-transaction/:id"
            element={<PrivateRoute element={<View_Transactions />} />}
          />
          <Route
            path="/admin/transactions"
            element={<PrivateRoute element={<View_All_Transactions />} />}
          />
          <Route path="/admin" element={<PrivateRoute element={<Home />} />} />
          <Route
            path="/admin/view_user_account"
            element={<PrivateRoute element={<View_accounts />} />}
          />
          <Route
            path="/admin/edit-user/:id"
            element={<PrivateRoute element={<Edit_User />} />}
          />
          <Route
            path="/admin/user-transaction/:id"
            element={<PrivateRoute element={<User_Transaction />} />}
          />

          <Route
            path="/user/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/user/budgetset"
            element={<PrivateRoute element={<BudgetSet />} />}
          />
          <Route
            path="/user/transaction"
            element={<PrivateRoute element={<Transaction />} />}
          />
          <Route path="/user/logout" element={<div>Logout</div>} />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
