import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const User_Transaction = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/Admin/transaction_user/${id}`,
        {
          validateStatus: () => true,
        }
      );
      if (result.status === 200) {
        setTransactions(result.data);
      } else {
        console.error("Failed to load categories or invalid format");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  if (!transactions) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr className="text-center">
            <th>Expense ID</th>
            <th>Category Name</th>
            <th>Budget</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {transactions.map((transaction, index) => (
            <tr key={transaction.id}>
              <td style={{verticalAlign: "middle"}}>
                {transaction.id}
              </td>
              <td style={{verticalAlign: "middle"}}>
                {transaction.category.name}
              </td>
              <td style={{ verticalAlign: "middle" }}>
                {transaction.category.budget}
              </td>
              <td style={{ verticalAlign: "middle" }}>{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default User_Transaction;
