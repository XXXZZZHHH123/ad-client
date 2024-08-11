import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Select } from "antd";
import axios from "axios";

const { Option } = Select;

const ExpenseLineChart = ({ userId }) => {
  const [data, setData] = useState([]);
  const [timeSpan, setTimeSpan] = useState("week");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
            `http://3.227.89.83:8080/User/transaction/${userId}`
        );
        const transactions = response.data;

        const groupedData = {};
        transactions.forEach((transaction) => {
          const date = transaction.created_at.split("T")[0]; // 提取日期部分
          if (!groupedData[date]) {
            groupedData[date] = 0;
          }
          groupedData[date] += transaction.amount;
        });

        let filteredData;
        const now = new Date();
        let startDate;

        if (timeSpan === "week") {
          startDate = new Date();
          startDate.setDate(now.getDate() - 7);
        } else if (timeSpan === "month") {
          startDate = new Date();
          startDate.setMonth(now.getMonth() - 1);
        } else if (timeSpan === "year") {
          startDate = new Date();
          startDate.setFullYear(now.getFullYear() - 1);
        }

        filteredData = Object.keys(groupedData)
            .filter((date) => new Date(date) >= startDate && new Date(date) <= now)
            .map((date) => ({ date, amount: groupedData[date] }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        setData(filteredData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, [userId, timeSpan]);

  const handleTimeSpanChange = (value) => {
    setTimeSpan(value);
  };

  return (
      <div style={{ margin: "20px" }}>
        <Select
            defaultValue="week"
            style={{ width: 120, marginBottom: "20px" }}
            onChange={handleTimeSpanChange}
        >
          <Option value="week">lastWeek</Option>
          <Option value="month">lastMonth</Option>
          <Option value="year">lastYear</Option>
        </Select>
        <ResponsiveContainer width={760} height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
  );
};

export default ExpenseLineChart;