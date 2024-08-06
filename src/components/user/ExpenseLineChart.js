import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ExpenseLineChart = ({ userId }) => {
    const [data, setData] = useState([]);
    const [timeSpan, setTimeSpan] = useState('week');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/User/transaction/${userId}`);
                const transactions = response.data;

                const groupedData = {};
                transactions.forEach(transaction => {
                    const date = transaction.created_at.split('T')[0]; // 提取日期部分
                    if (!groupedData[date]) {
                        groupedData[date] = 0;
                    }
                    groupedData[date] += transaction.amount;
                });

                let filteredData;
                const now = new Date();

                if (timeSpan === 'week') {
                    const lastWeek = new Date();
                    lastWeek.setDate(now.getDate() - 7);
                    filteredData = Object.keys(groupedData)
                        .filter(date => new Date(date) >= lastWeek)
                        .map(date => ({ date, amount: groupedData[date] }))
                        .sort((a, b) => new Date(a.date) - new Date(b.date));
                } else if (timeSpan === 'month') {
                    const lastMonth = new Date();
                    lastMonth.setMonth(now.getMonth() - 1);
                    filteredData = Object.keys(groupedData)
                        .filter(date => new Date(date) >= lastMonth)
                        .map(date => ({ date, amount: groupedData[date] }))
                        .sort((a, b) => new Date(a.date) - new Date(b.date));
                } else if (timeSpan === 'year') {
                    const lastYear = new Date();
                    lastYear.setFullYear(now.getFullYear() - 1);
                    filteredData = Object.keys(groupedData)
                        .filter(date => new Date(date) >= lastYear)
                        .map(date => ({ date, amount: groupedData[date] }))
                        .sort((a, b) => new Date(a.date) - new Date(b.date));
                }

                setData(filteredData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchData();
    }, [userId, timeSpan]);

    const handleTimeSpanChange = (value) => {
        setTimeSpan(value);
    };

    return (
        <div style={{ margin: '20px' }}>
            <Select defaultValue="week" style={{ width: 120, marginBottom: '20px' }} onChange={handleTimeSpanChange}>
                <Option value="week">Weekly</Option>
                <Option value="month">Monthly</Option>
                <Option value="year">Yearly</Option>
            </Select>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseLineChart;