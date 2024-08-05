import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Add = () => {
  let navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    budget: "",
    type: "",
  });
  const { name, budget, type } = category;

  const handleInputChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/Admin/add/1", category, {
        withCredentials: true, // 确保请求携带凭证
      });
      navigate("/admin/view-categories-system");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="col-sm-8 py-2 px-5">
      <h2 className="mt-5">Add Category</h2>
      <form onSubmit={(e) => saveCategory(e)}>
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
              to={"/view-categories"}
              type="submit"
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

export default Add;
