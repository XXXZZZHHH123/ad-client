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
        `http://localhost:8080/Admin/transaction_detail/${id}`,
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
      <h2>Transaction Details</h2>
      <p>
        <strong>ID:</strong> {transaction.id}
      </p>
      <p>
        <strong>Amount:</strong> {transaction.amount}
      </p>
      <p>
        <strong>Category:</strong> {transaction.category.name}
      </p>
      <p>
        <strong>Description:</strong> {transaction.description}
      </p>
      <p>
        <strong>Created At:</strong> {transaction.created_at}
      </p>
      <p>
        <strong>Updated At:</strong> {transaction.updated_at}
      </p>
    </div>
  );
};

export default Transaction_Detail;
