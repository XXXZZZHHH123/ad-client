import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const CategoryBarChart = ({ userId }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/Admin/transaction_user/${userId}`);
                const transactions = response.data;

                const now = new Date();
                // 设置 startDate 为当前月份的第一天
                const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

                // 分组数据
                const groupedData = {};
                transactions.forEach((transaction) => {
                    const date = new Date(transaction.created_at);
                    const category = transaction.category.name;
                    const budget = transaction.category.budget;

                    if (!groupedData[category]) {
                        groupedData[category] = { real: 0, budget: budget };
                    }

                    // 仅统计当前月份的交易
                    if (date >= startDate && date <= now) {
                        groupedData[category].real += transaction.amount;
                    }
                });

                const filteredData = Object.keys(groupedData).map((category) => ({
                    category,
                    real: groupedData[category].real,
                    budget: groupedData[category].budget,
                }));

                setData(filteredData);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div style={{ margin: "20px" }}>
            <ResponsiveContainer width={700} height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="real" fill="#8884d8" name="Real Expense" />
                    <Bar dataKey="budget" fill="#82ca9d" name="Budget Amount" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryBarChart;