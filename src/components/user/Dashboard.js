import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TotalExpense from './TotalExpense'; // 确保路径正确
import TotalBudget from './TotalBudget'; // 确保路径正确
import BudgetUtilization from './BudgetUtilization'; // 确保路径正确
import ExpenditureCategories from './ExpenditureCategories';
import { Row, Col } from 'antd';
import './Dashboard.css'; // 确保你创建了一个对应的 CSS 文件
import './BudgetUtilization.css'


const Dashboard = () => {
    const [totalAmount, setTotalAmount] = useState(0.0);
    const [percentageChange, setPercentageChange] = useState(0);
    const [totalBudget, setTotalBudget] = useState(0.0);
    const userId = 1; // 替换为实际的用户ID

    useEffect(() => {
        const fetchTotalAmount = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/User/total-spending-last-month/${userId}`);
                const totalAmount = response.data;
                setTotalAmount(totalAmount);

                const previousMonthResponse = await axios.get(`http://localhost:8080/User/total-spending-previous-month/${userId}`);
                const previousMonthAmount = previousMonthResponse.data;

                const change = ((totalAmount - previousMonthAmount) / previousMonthAmount) * 100;
                setPercentageChange(change);
            } catch (error) {
                console.error('Error fetching total amount:', error);
            }
        };

        const fetchTotalBudget = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/User/categories/total-budget/${userId}`);
                setTotalBudget(response.data);
            } catch (error) {
                console.error('Error fetching total budget:', error);
            }
        };

        fetchTotalAmount();
        fetchTotalBudget();
    }, [userId]);

    return (
        <div className="dashboard-container">
            <Row gutter={[16, 16]}>
                <Col>
                    <TotalExpense amount={totalAmount} percentageChange={percentageChange} />
                </Col>
                <Col>
                    <TotalBudget budget={totalBudget} />
                </Col>
                <Col>
                    <BudgetUtilization userId={userId} />
                </Col>
                <Col span={24}>
                    <ExpenditureCategories userId={userId} />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;