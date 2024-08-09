import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/Admin/categories/0",
        {
          validateStatus: () => true,
        }
      );
      if (result.status === 200 && Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        console.error("Failed to load categories or invalid format");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/Admin/delete/${id}`);
    loadCategories();
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>System Defined Budgets</h2>
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
            <th>Transactions</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {categories.map((category, index) => (
            <tr key={category.id}>
              <th scope="row" key={index} style={{ verticalAlign: "middle" }}>
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
