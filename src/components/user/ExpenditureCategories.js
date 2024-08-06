import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import './Dashboard.css'

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384',
    '#AA00FF', '#FF00AA', '#00FFAA', '#FFAA00', '#AAFF00',
    '#00AAFF', '#AA00AA', '#AAAA00', '#00AAAA', '#AA5500'
];

const ExpenditureCategories = ({ userId }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/User/transaction/${userId}`);
                const transactions = response.data;

                // 处理数据，提取每个交易的类别名和金额
                const categoryMap = {};
                transactions.forEach(transaction => {
                    const categoryName = transaction.category.name;
                    const amount = transaction.amount;
                    if (categoryMap[categoryName]) {
                        categoryMap[categoryName] += amount;
                    } else {
                        categoryMap[categoryName] = amount;
                    }
                });

                const data = Object.keys(categoryMap).map(key => ({
                    name: key,
                    amount: categoryMap[key]
                }));

                // 按金额从大到小排序
                const sortedData = data.sort((a, b) => b.amount - a.amount);
                setData(sortedData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchData();
    }, [userId]);

    const totalAmount = data.reduce((sum, entry) => sum + entry.amount, 0);
    const dataWithPercentage = data.map(entry => ({
        ...entry,
        percentage: ((entry.amount / totalAmount) * 100).toFixed(2)
    }));

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', margin: '20px' }}>
            <div style={{ width: '100%' }}>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={dataWithPercentage}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="amount"
                            nameKey="name"
                        >
                            {dataWithPercentage.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value} SGD`, name]}
                        />
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            formatter={(value) => {
                                const entry = dataWithPercentage.find(item => item.name === value);
                                return `${value} (${entry.percentage}%)`;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <h4 style={{ marginTop: '20px', textAlign: 'center' }}>Expenditure Categories</h4>
            </div>
        </div>
    );
};

export default ExpenditureCategories;