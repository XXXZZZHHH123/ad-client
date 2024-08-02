import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/admin"}>
          Admin
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                View Categories
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to={"/admin/view-categories_all"}
                  >
                    Categories (All)
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to={"/admin/view-categories-system"}
                  >
                    Categories (System)
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to={"/admin/view-categories-user"}
                  >
                    Categories (User)
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/admin/add-category"}>
                Add Categories (System)
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/admin/transactions"}>
                View All Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/admin/view_user_account"}>
                View All Users
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>
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
