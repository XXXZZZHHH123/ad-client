import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";
import { Button, Table, Input, Select, Modal, Form } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filters, setFilters] = useState({
    categoryName: "",
    amount: null,
    type: null,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/Admin/categories"
      );
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/Admin/delete/${id}`);
      loadCategories();
      alert("Delete successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("This category already has an expense and cannot be deleted.");
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    form.setFieldsValue({
      name: category.name,
      budget: category.budget,
      type: category.type === 0 ? "System Defined" : "User Defined",
    });
    setModalOpen(true);
  };

  const handleFilterChange = (type, value) => {
    const newFilters = {
      ...filters,
      [type]: value === undefined ? null : value,
    };
    setFilters(newFilters);
    filterCategories(newFilters);
  };

  const filterCategories = (newFilters) => {
    let result = categories;

    if (newFilters.categoryName) {
      result = result.filter((category) =>
        category.name
          .toLowerCase()
          .includes(newFilters.categoryName.toLowerCase())
      );
    }

    if (newFilters.amount !== null) {
      if (newFilters.amount === "low") {
        result = result.filter((category) => category.budget < 500);
      } else if (newFilters.amount === "medium") {
        result = result.filter(
          (category) => category.budget >= 500 && category.budget <= 1000
        );
      } else if (newFilters.amount === "high") {
        result = result.filter((category) => category.budget > 1000);
      }
    }

    if (newFilters.type !== null) {
      result = result.filter((category) => category.type === newFilters.type);
    }

    setFilteredCategories(result);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log("Form values: ", values);

        const { name, budget, type } = values;

        try {
          if (currentCategory) {
            await axios.put(
              `http://localhost:8080/Admin/update/${currentCategory.id}`,
              {
                name,
                budget: parseFloat(budget),
                type: type === "System Defined" ? 0 : 1,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          } else {
            await axios.post(
              "http://localhost:8080/Admin/add/1",
              {
                name,
                budget: parseFloat(budget),
                type: type === "System Defined" ? 0 : 1,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }

          loadCategories();
        } catch (error) {
          if (error.response && error.response.data) {
            console.error("Error:", error.response.data.message);
            alert(`Error: ${error.response.data.message}`);
          } else {
            console.error("Request failed with status code", error.message);
          }
        }

        setModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
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
    {
      title: "Type",
      key: "type",
      render: (text, record) =>
        record.type === 0 ? "System Defined" : "User Defined",
    },
    {
      title: "Defined by",
      dataIndex: ["user", "username"],
      key: "user.username",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            className="btn btn-primary"
            icon={<FaEye />}
            onClick={() => navigate(`/admin/category-transaction/${record.id}`)}
            style={{ marginRight: 8 }}
          ></Button>
          <Button
            className="btn btn-warning"
            icon={<FaEdit />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            className="btn btn-danger"
            icon={<FaTrashAlt />}
            onClick={() => handleDelete(record.id)}
          />
        </span>
      ),
      width: 300,
    },
  ];

  return (
    <div className="content">
      <h2>Budget Management</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Input
          placeholder="Search Category Name"
          onChange={(e) => handleFilterChange("categoryName", e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          onChange={(value) => handleFilterChange("amount", value)}
          placeholder="Select Amount"
          style={{ width: 150 }}
          allowClear
        >
          <Option value={null}>All Amounts</Option>
          <Option value="low">Less than 500</Option>
          <Option value="medium">500 - 1000</Option>
          <Option value="high">More than 1000</Option>
        </Select>
        <Select
          onChange={(value) => handleFilterChange("type", value)}
          placeholder="Select Type"
          style={{ width: 150 }}
          allowClear
        >
          <Option value={null}>All Types</Option>
          <Option value={0}>System Defined</Option>
          <Option value={1}>User Defined</Option>
        </Select>
        <Button
          type="primary"
          onClick={() => {
            setModalOpen(true);
            setCurrentCategory(null);
            form.resetFields();
          }}
          style={{
            marginLeft: "auto",
            backgroundColor: "#ff0000",
          }}
        >
          Add Category
        </Button>
      </div>
      <Table dataSource={filteredCategories} columns={columns} rowKey="id" />

      <Modal
        title={currentCategory ? "Edit Category" : "Add Category"}
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleModalOk}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Budget"
            name="budget"
            rules={[{ required: true, message: "Please input the budget!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Category Type"
            name="type"
            rules={[
              { required: true, message: "Please select a category type!" },
            ]}
          >
            <Select>
              <Option value="System Defined">System Defined</Option>
              <Option value="User Defined">User Defined</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesView;
