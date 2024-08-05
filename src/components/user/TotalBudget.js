// TotalBudget.js
import React from 'react';
import { Card, Typography } from 'antd';
import './Dashboard.css'; // 确保你创建了一个对应的 CSS 文件

const { Text } = Typography;

const TotalBudget = ({ budget }) => {
    return (
        <Card className="card" bordered={false}>
            <Text type="secondary">Total Budget</Text>
            <Typography.Title level={2}>${budget.toFixed(2)}</Typography.Title>
        </Card>
    );
};

export default TotalBudget;