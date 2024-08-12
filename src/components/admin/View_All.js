import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await axios.get("http://localhost:8080/Admin/categories", {
        withCredentials: true,
      });
      if (result.status === 200 && Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        setError("Failed to load categories or invalid format");
        console.error("Failed to load categories or invalid format", result);
      }
    } catch (error) {
      setError("Error fetching categories");
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/Admin/delete/${id}`
      );

      if (response.status === 204) {
        // 204 No Content
        loadCategories();
        alert("Delete successfully。");
      } else if (response.status === 409) {
        // 409 Conflict
        alert(response.data);
      } else if (response.status === 401) {
        // 401 Unauthorized
        alert("Unauthorized access, please log in first。");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(`${error.response.data}`);
      } else if (error.response) {
        alert(`${error.response.data}`);
      } else {
        console.error("Delete failed:", error);
        alert("Delete failed");
      }
    }
  };

  return (
    <section>
      {error && <div className="error">{error}</div>}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Budgets</h2>
        <Link to="/admin/add-category" className="btn btn-primary">
          <FaPlus /> New Budget
        </Link>
      </div>
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Defined by</th>
            <th>Expenses</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {categories.map((category, index) => (
            <tr key={category.id}>
              <th scope="row" style={{ verticalAlign: "middle" }}>
                {index + 1}
              </th>
              <td style={{ verticalAlign: "middle" }}>{category.name}</td>
              <td style={{ verticalAlign: "middle" }}>{category.budget}</td>
              <td style={{ verticalAlign: "middle" }}>
                {category.type === 0 ? "System Defined" : "User Defined"}
              </td>
              <td style={{ verticalAlign: "middle" }}>
                {category.user.username}
              </td>
              <td className="mx-2" style={{ verticalAlign: "middle" }}>
                <Link
                  to={`/admin/category-transaction/${category.id}`}
                  className="btn btn-info"
                >
                  <FaEye />
                </Link>
              </td>
              <td className="mx-2" style={{ verticalAlign: "middle" }}>
                <Link
                  to={`/admin/edit-category/${category.id}`}
                  className="btn btn-warning"
                >
                  <FaEdit />
                </Link>
              </td>
              <td className="mx-2" style={{ verticalAlign: "middle" }}>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(category.id)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CategoriesView;
