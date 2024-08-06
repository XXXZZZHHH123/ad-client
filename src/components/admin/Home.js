import React, { useState, useEffect } from "react";
import { Button } from "antd";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const Home = () => {
  const [systemCategories, setSystemCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const SystemcategoryType = 0;
  const UsercategoryType = 1;
  const navigate = useNavigate();

  useEffect(() => {
    loadSystemCategories();
    loadUserCategories();
  }, []);

  const loadSystemCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Admin/categories/${SystemcategoryType}`
      );
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

  const handleViewSystemDetails = () => {
    navigate("/admin/view-categories-system");
  };

  const handleViewUserDetails = () => {
    navigate("/admin/view-categories-user");
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

  return (
    <div className="Home-content">
      <div className="left-container">
        <h3>System defined categories</h3>
        <Button
          type="primary"
          onClick={handleViewSystemDetails}
          className="button"
        >
          View categories' details
        </Button>
        <PieChart width={400} height={410}>
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
            The pie chart on the left shows the amounts of all System defined
            categories and their proportions in all expenditures.
          </p>
          <p>
            If you want to modify categories, please click the "View categories'
            details" button.
          </p>
        </div>
      </div>
      <div className="right-container">
        <h3>User defined categories</h3>
        <Button
          type="primary"
          onClick={handleViewUserDetails}
          className="button"
        >
          View categories' details
        </Button>
        <PieChart width={400} height={410}>
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
            The pie chart on the top shows the amounts of all User defined
            categories and their proportions in all expenditures.
          </p>
          <p>
            If you want to modify categories, please click the "View categories'
            details" button.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
