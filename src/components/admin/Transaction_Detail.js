import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Transaction_Detail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      const result = await axios.get(
        `http://3.227.89.83:8080/Admin/transaction_detail/${id}`,
        {
          validateStatus: () => true,
        }
      );
      if (result.status === 200) {
        setTransaction(result.data);
      } else {
        console.error("Failed to load transaction details");
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Transaction Details</h3>
      <p> </p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>ID</strong>
            </td>
            <td>{transaction.id}</td>
          </tr>
          <tr>
            <td>
              <strong>User Name</strong>
            </td>
            <td>{transaction.user.username}</td>
          </tr>
          <tr>
            <td>
              <strong>Category</strong>
            </td>
            <td>{transaction.category.name}</td>
          </tr>
          <tr>
            <td>
              <strong>Amount</strong>
            </td>
            <td>{transaction.amount}</td>
          </tr>
          <tr>
            <td>
              <strong>Created At</strong>
            </td>
            <td>{transaction.created_at}</td>
          </tr>
          <tr>
            <td>
              <strong>Updated At</strong>
            </td>
            <td>{transaction.updated_at ? transaction.updated_at : "/"}</td>
          </tr>
          <tr>
            <td>
              <strong>Description</strong>
            </td>
            <td>{transaction.description ? transaction.description : "/"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transaction_Detail;
