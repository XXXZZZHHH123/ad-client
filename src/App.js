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

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const hideNavBarPaths = ["/login", "/privacy-policy", "/register"];

  const hideNavBar = hideNavBarPaths.includes(location.pathname);

  return (
    <main className="container mt-5">
      {!hideNavBar && location.pathname.startsWith("/admin") && <AdminNavBar />}
      {!hideNavBar && location.pathname.startsWith("/user") && <NavBar />}
      <div className="site-layout-content" style={{ margin: "16px 0" }}>
        <Routes>
          {/* Common Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/view-categories_all" element={<View_All />} />
          <Route
            path="/admin/view-categories-system"
            element={<SystemCategoriesView />}
          />
          <Route
            path="/admin/view-categories-user"
            element={<UserCategoriesView />}
          />
          <Route path="/admin/add-category" element={<Add />} />
          <Route path="/admin/edit-category/:id" element={<Edit />} />
          <Route
            path="/admin/transaction-description/:id"
            element={<Transaction_Detail />}
          />
          <Route
            path="/admin/category-transaction/:id"
            element={<View_Transactions />}
          />
          <Route
            path="/admin/transactions"
            element={<View_All_Transactions />}
          />
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/view_user_account" element={<View_accounts />} />
          <Route path="/admin/edit-user/:id" element={<Edit_User />} />
          <Route
            path="/admin/user-transaction/:id"
            element={<User_Transaction />}
          />
          {/* User Routes */}
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/user/budgetset" element={<BudgetSet />} />
          <Route path="/user/transaction" element={<Transaction />} />
          <Route path="/user/logout" element={<div>Logout</div>} />

          {/* Default Route */}
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
