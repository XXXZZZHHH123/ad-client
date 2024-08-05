import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEye, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await axios.get("http://localhost:8080/Admin/categories", {
        withCredentials: true, // 确保请求携带凭证
        validateStatus: () => true,
      });
      console.log("Response Data:", result.data); // 添加日志
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
      await axios.delete(`http://localhost:8080/Admin/delete/${id}`, {
        withCredentials: true, // 确保请求携带凭证
      });
      loadCategories();
    } catch (error) {
      setError("Error deleting category");
      console.error("Error deleting category:", error);
    }
  };

  return (
    <section>
      {error && <div className="error">{error}</div>}
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Category Name</th>
            <th>Budget</th>
            <th>Type</th>
            <th>Defined by</th>
            <th>Transactions</th>
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
