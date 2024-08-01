import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState({
    name: "",
    budget: "",
    type: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const result = await axios.get(
      `http://localhost:8080/Admin/category/${id}`
    );
    setCategory(result.data);
  };

  const { name, budget, type } = category;

  const handleInputChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    const { name, budget, type } = category; // 只提取必要字段
    try {
      const response = await axios.put(
        `http://localhost:8080/Admin/update/${id}`,
        JSON.stringify({ name, budget: parseFloat(budget), type }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/admin/view-categories-system");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error:", error.response.data.message);
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Request failed with status code", error.message);
      }
    }
  };

  return (
    <div className="col-sm-8 py-2 px-5">
      <h2 className="mt-5">Edit Category</h2>
      <form onSubmit={(e) => updateCategory(e)}>
        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="name">
            Name
          </label>
          <input
            className="form-control col-sm-6"
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="budget">
            Budget
          </label>
          <input
            className="form-control col-sm-6"
            type="number"
            name="budget"
            id="budget"
            required
            value={budget}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="type">
            Category Type
          </label>
          <select
            className="form-control col-sm-6"
            name="type"
            id="type"
            required
            value={type}
            onChange={(e) => handleInputChange(e)}
          >
            <option value="">Select Type</option>
            <option value="0">System Defined</option>
            <option value="1">User Defined</option>
          </select>
        </div>

        <div className="row mb-5">
          <div className="col-sm-2">
            <button type="submit" className="btn btn-outline-success btn-lg">
              Save
            </button>
          </div>

          <div className="col-sm-2">
            <Link
              to={"/admin/view-categories"}
              className="btn btn-outline-warning btn-lg"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit;
