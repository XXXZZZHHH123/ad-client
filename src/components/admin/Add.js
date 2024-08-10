import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminHome.css";

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
        withCredentials: true,
      });
      navigate("/admin/view-categories_all");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="form-container">
      <h3>Add Budget</h3>
      <p></p>
      <form onSubmit={(e) => saveCategory(e)}>
        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="name">
            Name
          </label>
          <input
            className="form-control input-wide"
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
            Amount
          </label>
          <input
            className="form-control input-wide"
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
            className="form-control input-wide"
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

        <div className="button-container">
          {" "}
          {}
          <button type="submit" className="btn btn-outline-success btn-lg">
            Save
          </button>
          <Link
            to={"/admin/view-categories_all"}
            className="btn btn-outline-warning btn-lg"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Add;
