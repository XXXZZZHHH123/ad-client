import React, { useState, useEffect } from 'react';
import LiquidFillGauge from 'react-liquid-gauge';
import axios from 'axios';
import { getGradientColor } from './gradientColor';

const BudgetUtilization = ({ userId }) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const fetchBudgetUtilization = async () => {
            try {
                const expenseResponse = await axios.get(`http://localhost:8080/User/total-spending-this-month/${userId}`);
                const totalExpense = expenseResponse.data;

                const budgetResponse = await axios.get(`http://localhost:8080/User/categories/total-budget/${userId}`);
                const totalBudget = budgetResponse.data;

                const rate = (totalExpense / totalBudget) * 100;
                setValue(rate);
            } catch (error) {
                console.error('Error fetching budget utilization:', error);
            }
        };

        fetchBudgetUtilization();
    }, [userId]);

    const gradientStops = [
        { key: '0%', stopColor: getGradientColor(value), stopOpacity: 1 },
        { key: '50%', stopColor: getGradientColor(value), stopOpacity: 0.75 },
        { key: '100%', stopColor: getGradientColor(value), stopOpacity: 0.5 },
    ];

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <LiquidFillGauge
                style={{ margin: '0 auto' }}
                width={200}
                height={200}
                value={Math.min(value, 100)} // 限制水波填充的最大值为 100
                percent="%"
                textSize={1}
                textOffsetX={0}
                textOffsetY={0}
                textRenderer={() => (
                    <tspan>
                        <tspan className="value" style={{ fontSize: '24px' }}>{value.toFixed(2)}</tspan>
                        <tspan>%</tspan>
                    </tspan>
                )}
                riseAnimation
                waveAnimation
                waveFrequency={2}
                waveAmplitude={3}
                gradient
                gradientStops={gradientStops}
                circleStyle={{ fill: getGradientColor(value) }}
                waveStyle={{ fill: getGradientColor(value) }}
            />
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
                Monthly budget utilization rate
            </div>
        </div>
    );
};

export default BudgetUtilization;