import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { WordCloud } from "@ant-design/plots";
import { useUser } from "../../UserContext"; // 确保路径正确

const BudgetSet = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [currentCategory, setCurrentCategory] = useState(null);
  const { userId } = useUser(); // 动态获取当前用户的ID
  const [SystemCategories, setSystemCategories] = useState([]);

  useEffect(() => {
    if (userId) {
      loadSystemCategories();
      loadCategories();
    }
  }, [userId]);

  const loadSystemCategories = async () => {
    try {
      const result = await axios.get(
          "http://3.227.89.83:8080/Admin/categories/0",
          {
            validateStatus: () => true,
          }
      );
      if (result.status === 200 && Array.isArray(result.data)) {
        setSystemCategories(result.data);
      } else {
        console.error("Failed to load categories or invalid format");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get(
          `http://3.227.89.83:8080/User/budget/${userId}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createCategory = async (values) => {
    try {
      const response = await axios.post(
          `http://3.227.89.83:8080/User/budget/add/${userId}`,
          {
            name: values.category,
            budget: values.amount,
            type: 1,
          }
      );
      message.success("Category created successfully");
      setCategories((prevCategories) => [...prevCategories, response.data]);
    } catch (error) {
      console.error("Error creating category:", error);
      message.error("Category with the same name already exists");
    }
  };

  const updateCategory = async (values) => {
    try {
      await axios.put(
        `http://3.227.89.83:8080/User/budget/update/${currentCategory.id}`,
        {
          budget: values.amount,
        }
      );
      message.success("Category updated successfully");
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === currentCategory.id
            ? { ...cat, budget: values.amount }
            : cat
        )
      );
    } catch (error) {
      console.error("Error updating category:", error);
      message.error("Failed to update category");
    }
  };

  const handleSubmit = async (values) => {
    if (currentCategory) {
      await updateCategory(values);
    } else {
      await createCategory(values);
    }
    setModalOpen(false);
    form.resetFields();
    setCurrentCategory(null);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    form.setFieldsValue({
      amount: category.budget,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const category = categories.find((cat) => cat.id === id);
    if (category && category.type === 0) {
      message.error("Cannot delete system-defined category");
      return;
    }
    try {
      await axios.delete(`http://3.227.89.83:8080/User/budget/delete/${id}`);
      message.success("Category deleted successfully");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("This category is already used");
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount(SGD)",
      dataIndex: "budget",
      key: "budget",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            icon={<FaEdit />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="danger"
            icon={<FaTrashAlt />}
            onClick={() => handleDelete(record.id)}
          />
        </span>
      ),
    },
  ];

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

  const wordCloudConfig = {
    data: categories.map((category) => ({
      text: category.name,
      value: category.budget,
    })),
    wordField: "text",
    weightField: "value",
    colorField: "text",
    wordStyle: {
      fontFamily: "Verdana",
      fontSize: [12, 40],
      rotation: 0,
    },
    layout: { spiral: "rectangular" },
  };

  return (
    <div className="content">
      <h2>Budget Planner(Monthly)</h2>
      <Button
        type="primary"
        onClick={() => {
          setModalOpen(true);
          setCurrentCategory(null);
        }}
      >
        Add Budget
      </Button>
      <Table dataSource={categories} columns={columns} rowKey="id" />

      <Modal
        title={currentCategory ? "Edit Budget" : "Add Budget"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setCurrentCategory(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {!currentCategory && (
            <Form.Item
              label="Enter Budget Category"
              name="category"
              rules={[{ required: true, message: "Please enter a category!" }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="Set Budget Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter the amount!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <PieChart width={410} height={410}>
          <Pie
            data={categories}
            dataKey="budget"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {categories.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCategoryColor(index)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        <WordCloud {...wordCloudConfig} />
      </div>
    </div>
  );
};

export default BudgetSet;
