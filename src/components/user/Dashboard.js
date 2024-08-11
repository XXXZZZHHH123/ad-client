import React, { useEffect, useState } from "react";
import axios from "axios";
import TotalExpense from "./TotalExpense"; // 确保路径正确
import TotalBudget from "./TotalBudget"; // 确保路径正确
import BudgetUtilization from "./BudgetUtilization"; // 确保路径正确
import ExpenditureCategories from "./ExpenditureCategories";
import ExpenseLineChart from "./ExpenseLineChart";
import CategoryBarChart from "./CategoryBarChart";
import "./Dashboard.css";
import { useUser } from "../../UserContext";

const Dashboard = () => {
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0.0);
  const { userId } = useUser();

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const response = await axios.get(
          `http://3.227.89.83:8080/User/total-spending-this-month/${userId}`
        );
        const totalAmount = response.data;
        setTotalAmount(totalAmount);

        const previousMonthResponse = await axios.get(
          `http://3.227.89.83:8080/User/total-spending-previous-month/${userId}`
        );
        const previousMonthAmount = previousMonthResponse.data;

        const change =
          ((totalAmount - previousMonthAmount) / previousMonthAmount) * 100;
        setPercentageChange(change);
      } catch (error) {
        console.error("Error fetching total amount:", error);
      }
    };

    const fetchTotalBudget = async () => {
      try {
        const response = await axios.get(
          `http://3.227.89.83:8080/User/categories/total-budget/${userId}`
        );
        setTotalBudget(response.data);
      } catch (error) {
        console.error("Error fetching total budget:", error);
      }
    };

    fetchTotalAmount();
    fetchTotalBudget();
  }, [userId]);

  return (
      // <div className="home-container">
      //   <div className="chart-wrapper">
      //     <div className="chart-container">
      //       <div className="total-expense">
      //         <TotalExpense
      //             amount={totalAmount}
      //             percentageChange={percentageChange}
      //         />
      //       </div>
      //       <div className="total-budget">
      //         <TotalBudget budget={totalBudget}/>
      //       </div>
      //       <div className="budget-utilization-container">
      //         <BudgetUtilization userId={userId}/>
      //       </div>
      //     </div>
      //     <div className="chart-container">
      //       <div span={16} className="expenditure-categories">
      //         <ExpenditureCategories userId={userId}/>
      //       </div>
      //     </div>
      //   </div>
      //
      //   <div className="chart-wrapper">
      //     <div className="chart-container">
      //       <ExpenseLineChart width={800} height={300} userId={userId}/>
      //     </div>
      //     <div className="chart-container">
      //       <CategoryBarChart width={800} height={300} userId={userId}/>
      //     </div>
      //   </div>
      // </div>

  <div className="home-container">
    <div className="chart-wrapper">
      <div className="chart-container-left-top">
        <div className="budget-utilization-container">
          <BudgetUtilization userId={userId}/>
        </div>
        <div>
          <div className="total-expense">
            <TotalExpense
                amount={totalAmount}
                percentageChange={percentageChange}
            />
          </div>
          <div className="total-budget">
            <TotalBudget budget={totalBudget}/>
          </div>
        </div>
      </div>
    </div>
    <div className="chart-wrapper">
      <div span={16} className="expenditure-categories">
        <ExpenditureCategories userId={userId}/>
      </div>
    </div>

    <div className="chart-wrapper">
      <ExpenseLineChart width={800} height={300} userId={userId}/>
    </div>
    <div className="chart-wrapper">
      <CategoryBarChart width={800} height={300} userId={userId}/>
    </div>
  </div>
)
  ;
};

export default Dashboard;
