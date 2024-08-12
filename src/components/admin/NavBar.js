import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminHome.css";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/logout",
        {},
        { withCredentials: true }
      );
      sessionStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white mb-5 w-100 custom-navbar-red">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/admin"}>
          SmartBook
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Budgets
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to={"/admin/view-categories_all"}
                  >
                    Budgets (All)
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to={"/admin/view-categories-system"}
                  >
                    Budgets (System)
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to={"/admin/view-categories-user"}
                  >
                    Budgets (User)
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/admin/transactions"}>
                Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/admin/view_user_account"}>
                Users
              </Link>
            </li>
            <li className="nav-item ms-auto">
              <button
                className="btn"
                style={{
                  backgroundColor: "#ffffff", // 白色背景
                  color: "#ff0000", // 红色字体
                  border: "2px solid #ff0000", // 红色边框
                }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
