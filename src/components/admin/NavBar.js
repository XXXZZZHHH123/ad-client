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
    <nav className="navbar navbar-expand-lg navbar-light bg-white mb-10 w-100 custom-navbar-red">
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
            <li className="nav-item">
              <Link className="nav-link" to={"/admin/view-categories_all"}>
                Budgets
              </Link>
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
                  backgroundColor: "#ffffff",
                  color: "#ff0000",
                  border: "2px solid #ff0000",
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
