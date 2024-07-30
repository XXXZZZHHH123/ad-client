import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import axios from "axios";

const BudgetSet = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const userId = 1; // 假设你已经获取了当前用户的ID

  useEffect(() => {
    // Fetch categories from the server
    fetch("/User/budgets") // 替换为实际的 API 端点
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`/User/add/${userId}`, {
        name: values.category,
        budget: values.amount,
        type: 1, // 或者根据你的需求设置适当的类型
      });
      console.log("Category created:", response.data);
      // 更新categories状态以反映新添加的类别
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "budget",
      key: "budget",
    },
  ];

  return (
    <div className="content">
      <h2>Budget Planner</h2>
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Add Budget
      </Button>
      <Table dataSource={categories} columns={columns} rowKey="name" />

      <Modal
        title="Add Budget"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Enter Budget Category"
            name="category"
            rules={[{ required: true, message: "Please enter a category!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Set Budget Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter the amount!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BudgetSet;
