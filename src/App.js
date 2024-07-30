import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import Home from "./components/admin/Home";
import BudgetSet from "./components/user/BudgetSet";
import AdminHome from "./components/admin/Home";
import CategoriesView from "./components/admin/CategoriesView";
import Add from "./components/admin/Add";
import Edit from "./components/admin/Edit";
import SystemCategoriesView from "./components/admin/View_System.js";
import UserCategoriesView from "./components/admin/View_User.js";
import View_Transactions from "./components/admin/View_Transactions.js";
import Transaction_Detail from "./components/admin/Transaction_Detail.js";
import AdminNavBar from "./components/admin/NavBar";
import UserNavBar from "./components/user/NavBar";

const { Header, Content } = Layout;

const App = () => {
  // 假设有一个方法来确定当前用户的角色
  const isAdmin = false; // 根据实际情况设置

  return (
    <Router>
      <Layout>
        <Header>{isAdmin ? <AdminNavBar /> : <UserNavBar />}</Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content" style={{ margin: "16px 0" }}>
            <Routes>
              {isAdmin ? (
                <>
                  <Route exact path="/" element={<Home />} />
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
                </>
              ) : (
                <>
                  <Route exact path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/budgetset" element={<BudgetSet />} />
                  <Route path="/logout" element={<div>Logout</div>} />
                </>
              )}
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
