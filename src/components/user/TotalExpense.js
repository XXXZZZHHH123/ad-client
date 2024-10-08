// TotalExpense.js
import React from 'react';
import { Tooltip, Card, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './Dashboard.css'; // 确保你创建了一个对应的 CSS 文件

const { Text } = Typography;

const TotalExpense = ({ amount, percentageChange }) => {
    const isPositive = percentageChange < 0; // 下降用绿色
    const percentageColor = isPositive ? 'green' : 'red';

    return (
        <Card className="card" bordered={false}>
            <Tooltip title="From the 1st of this month">
            <Text type="secondary">Monthly Expense</Text>
            </Tooltip>
            <Typography.Title level={2}>${amount.toFixed(0)}</Typography.Title>
            <div className="percentage-change" style={{ color: percentageColor }}>
                {isPositive ? <ArrowDownOutlined /> : <ArrowUpOutlined />} {Math.abs(Math.round(percentageChange))}%
            </div>
        </Card>
    );
};

export default TotalExpense;