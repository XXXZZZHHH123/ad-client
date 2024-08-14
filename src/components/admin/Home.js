import React, { useState, useEffect } from "react";
import { Button } from "antd";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const Home = () => {
  const [systemCategories, setSystemCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [averageAmounts, setAverageAmounts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const UsercategoryType = 1;
  const navigate = useNavigate();

  useEffect(() => {
    loadSystemCategories();
    loadUserCategories();
    loadAverageAmounts();
    loadTopCategories();
  }, []);

  const loadSystemCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/User/budget/1`);
      setSystemCategories(response.data);
    } catch (error) {
      console.error("Error fetching system categories:", error);
    }
  };

  const loadUserCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Admin/categories/${UsercategoryType}`
      );
      setUserCategories(response.data);
    } catch (error) {
      console.error("Error fetching user categories:", error);
    }
  };

  const loadAverageAmounts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Admin/average-amount-per-category`
      );
      const averageAmountsData = response.data;

      const averageAmountsMap = {};
      averageAmountsData.forEach((item) => {
        averageAmountsMap[item[0]] = item[1];
      });

      console.log("Average Amounts Map:", averageAmountsMap);
      setAverageAmounts(averageAmountsMap);
    } catch (error) {
      console.error("Error fetching average amounts:", error);
    }
  };

  const loadTopCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/Admin/top-categories"
      );
      const topCategoriesData = response.data;

      const formattedData = topCategoriesData.map((item) => ({
        name: item[0],
        usageCount: item[1],
      }));

      setTopCategories(formattedData);
    } catch (error) {
      console.error("Error fetching top categories:", error);
    }
  };

  const handleViewSystemDetails = () => {
    navigate("/admin/view-categories-system");
  };

  const handleViewUserDetails = () => {
    navigate("/admin/view-categories-user");
  };

  const handleViewTransaction = () => {
    navigate("/admin/transactions");
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#8dd1e1",
    "#83a6ed",
    "#8e4585",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#d0ed57",
    "#a4de6c",
    "#4caf50",
    "#f44336",
    "#2196f3",
    "#9c27b0",
    "#3f51b5",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#bdbdbd",
    "#78909c",
    "#ffccbc",
    "#ffab91",
    "#d32f2f",
    "#c2185b",
    "#7b1fa2",
    "#512da8",
    "#303f9f",
    "#0288d1",
    "#0097a7",
    "#00796b",
    "#388e3c",
    "#689f38",
    "#afb42b",
    "#fbc02d",
  ];

  const getCategoryColor = (index) => COLORS[index % COLORS.length];

  const mergedData = systemCategories.map((category) => {
    return {
      name: category.name,
      amount: category.budget,
      averageAmount: averageAmounts[category.name] || 0,
    };
  });

  return (
    <div className="home-container">
      <div className="chart-wrapper1">
        <div className="chart-container">
          <h3>System Defined Budgets</h3>
          <Button
            type="primary"
            onClick={handleViewSystemDetails}
            className="button"
          >
            View Budgets' Details
          </Button>
          <PieChart width={400} height={450}>
            <Pie
              data={systemCategories}
              dataKey="budget"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {systemCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(index)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div className="description">
            <p>
              The pie chart above shows the amounts of all System defined
              budgets and their proportions in all expenditures.
            </p>
            <p>
              If you want to modify budgets, please click the "View budgets'
              details" button.
            </p>
          </div>
        </div>

        <div className="chart-container">
          <h3>Budget Amount / Average Amount</h3>
          <Button
            type="primary"
            onClick={handleViewTransaction}
            className="button"
          >
            View Transactions
          </Button>
          <BarChart width={700} height={300} data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" name="Budget Amount" />
            <Bar dataKey="averageAmount" fill="#82ca9d" name="Average Amount" />
          </BarChart>
          <div className="description">
            <p>
              The bar chart above illustrates a comparison between the amounts
              of all system-defined budgets and the user's average monthly
              expenditure in this category.
            </p>
            <p>
              If you want to view transations, please click the "View
              transactions" button.
            </p>
          </div>
        </div>
      </div>

      <div className="chart-wrapper1">
        <div className="chart-container">
          <h3>User Defined Budgets</h3>
          <Button
            type="primary"
            onClick={handleViewUserDetails}
            className="button"
          >
            View Budgets' Details
          </Button>
          <PieChart width={500} height={450}>
            <Pie
              data={userCategories}
              dataKey="budget"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {userCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(index)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div className="description">
            <p>
              The pie chart above shows the amounts of all User defined budgets
              and their proportions in all expenditures.
            </p>
            <p>
              If you want to modify budgets, please click the "View budgets'
              details" button.
            </p>
          </div>
        </div>

        <div className="chart-container">
          <h3>Top Categories By Usage</h3>
          <Button
            type="primary"
            onClick={handleViewTransaction}
            className="button"
          >
            View Transactions
          </Button>
          <BarChart width={700} height={300} data={topCategories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usageCount" fill="#8884d8" name="Usage Count" />
          </BarChart>
          <div className="description">
            <p>
              The bar chart above shows the top categories by transactions
              count, it only select top five categories which can be add to
              System defined budgets
            </p>
            <p>
              If you want to view transations, please click the "View
              transactions" button.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
