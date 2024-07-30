import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const result = await axios.get("http://localhost:8080/Admin/categories", {
      validateStatus: () => {
        return true;
      },
    });
    if (result.status === 200) {
      setCategories(result.data);
    }
  };

  return (
    <section>
      <table className="table table-bordered table-hover">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Category Name</th>
            <th>Budget</th>
            <th>UserId</th>
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
              <td>{category.user.id}</td>
              <td>{category.type}</td>
              <td className="mx-2">
                <button className="btn btn-info">View</button>
              </td>
              <td className="mx-2">
                <button className="btn btn-warning">Update</button>
              </td>
              <td className="mx-2">
                <button className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CategoriesView;
