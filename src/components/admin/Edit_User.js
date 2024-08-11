import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const Edit_User = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await axios.get(`http://3.227.89.83:8080/Admin/user/${id}`);
    setUser(result.data);
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const { username, password, email } = user;
    try {
      const response = await axios.put(
        `http://3.227.89.83:8080/Admin/updateUser/${id}`,
        { username, password, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/admin/view_user_account");
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
      <h2 className="mt-5">Edit User</h2>
      <form onSubmit={(e) => updateUser(e)}>
        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="username">
            Username
          </label>
          <input
            className="form-control col-sm-6"
            type="text"
            name="username"
            id="username"
            required
            value={user.username}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="password">
            Password
          </label>
          <input
            className="form-control col-sm-6"
            type="password"
            name="password"
            id="password"
            required
            value={user.password}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="email">
            Email
          </label>
          <input
            className="form-control col-sm-6"
            type="email"
            name="email"
            id="email"
            required
            value={user.email}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="row mb-5">
          <div className="col-sm-2">
            <button type="submit" className="btn btn-outline-success btn-lg">
              Save
            </button>
          </div>

          <div className="col-sm-2">
            <Link
              to={"/admin/view_user_account"}
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

export default Edit_User;
