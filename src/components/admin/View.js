import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEye, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const result = await axios.get("http://localhost:8080/Admin/categories/1", {
      validateStatus: () => {
        return true;
      },
    });
    if (result.status === 200) {
      setCategories(result.data);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/Admin/delete/${id}`);
    loadCategories();
  };

  return (
    <section>
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Category Name</th>
            <th>Budget</th>
            <th>Type</th>
            <th colSpan="3">Actions</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {categories.map((category, index) => (
            <tr key={category.id}>
              <th scope="row" key={index}>
                {index + 1}
              </th>
              <td>{category.name}</td>
              <td>{category.budget}</td>
              <td>{category.type === 0 ? "System Defined" : "User Defined"}</td>
              <td className="mx-2">
                <Link
                  to={`/category-profile/${category.id}`}
                  className="btn btn-info"
                >
                  <FaEye />
                </Link>
              </td>
              <td className="mx-2">
                <Link
                  to={`/edit-category/${category.id}`}
                  className="btn btn-warning"
                >
                  <FaEdit />
                </Link>
              </td>
              <td className="mx-2">
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
