import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const View_Transactions = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, [id]);

  const loadTransactions = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/Admin/transaction/${id}`,
        {
          validateStatus: () => true,
        }
      );
      if (result.status === 200 && Array.isArray(result.data)) {
        setTransactions(result.data);
      } else {
        console.error("Failed to load transactions or invalid format");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <section>
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>User</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {transactions.map((transaction, index) => (
            <tr key={transaction.id}>
              <th scope="row" key={index} style={{ verticalAlign: "middle" }}>
                {index + 1}
              </th>
              <td style={{ verticalAlign: "middle" }}>
                {transaction.user.username}
              </td>
              <td style={{ verticalAlign: "middle" }}>
                {transaction.category.name}
              </td>
              <td style={{ verticalAlign: "middle" }}>{transaction.amount}</td>
              <td style={{ verticalAlign: "middle" }}>
                {transaction.created_at}
              </td>
              <td style={{ verticalAlign: "middle" }}>
                {transaction.updated_at ? transaction.updated_at : "/"}
              </td>
              <td className="mx-2" style={{ verticalAlign: "middle" }}>
                <Link
                  to={`/admin/transaction-description/${transaction.id}`}
                  className="btn btn-info"
                >
                  <FaEye />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default View_Transactions;
