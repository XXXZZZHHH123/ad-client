import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEye, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const View_accounts = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/Admin/users", {
        validateStatus: () => true,
      });
      if (result.status === 200 && Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        console.error("Failed to load users or invalid format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/Admin/deleteuser/${id}`);
    loadUsers();
  };

  return (
    <section>
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>User Name</th>
            <th>Password</th>
            <th>Email</th>
            <th>Create time</th>
            <th>Transactions</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {users.map((user, index) => (
            <tr key={user.id}>
              <th scope="row" key={index} style={{ verticalAlign: "middle" }}>
                {index + 1}
              </th>
              <td style={{ verticalAlign: "middle" }}>{user.username}</td>
              <td style={{ verticalAlign: "middle" }}>{user.password}</td>
              <td style={{ verticalAlign: "middle" }}>{user.email}</td>
              <td style={{ verticalAlign: "middle" }}>{user.created_at}</td>
              <td className="mx-2" style={{ verticalAlign: "middle" }}>
                <Link
                  to={`/admin/user-transaction/${user.id}`}
                  className="btn btn-info"
                >
                  <FaEye />
                </Link>
              </td>
              <td className="mx-2" style={{ verticalAlign: "middle" }}>
                <Link
                  to={`/admin/edit-user/${user.id}`}
                  className="btn btn-warning"
                >
                  <FaEdit />
                </Link>
              </td>
              <td className="mx-2" style={{ verticalAlign: "middle" }}>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
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

export default View_accounts;
