import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  DatePicker,
} from "antd";

import { useParams } from "react-router-dom";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const View_Transactions = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    period: "",
    customRange: [],
    category: "",
    amount: null,
  });

  const headers = [
    { label: "Transaction ID", key: "id" },
    { label: "Username", key: "user.username" },
    { label: "Category", key: "category.name" },
    { label: "Amount(SGD)", key: "amount" },
    { label: "Order Date", key: "created_at" },
    { label: "Update Time", key: "updated_at" },
    { label: "Description", key: "description" },
  ];

  const { Search } = Input;
  const [activeFilter, setActiveFilter] = useState("");

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, [id]);

  const loadTransactions = async () => {
    try {
      const response = await axios.get(
          `http://localhost:8080/Admin/transactions`
      );
      const data = response.data.map((transaction) => ({
        ...transaction,
        created_at: moment(transaction.created_at).format("YYYY-MM-DD"),
      }));
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const [responseUser, responseSystem] = await Promise.all([
        axios.get("http://localhost:8080/Admin/categories_user/1"),
        axios.get("http://localhost:8080/Admin/categories/1"),
      ]);

      // 将两个响应的数据合并
      const combinedData = [...responseUser.data, ...responseSystem.data];
      setCategories(combinedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterTransactions = (newFilters) => {
    let result = transactions;
    const now = moment();
    let startDate, endDate;

    if (newFilters.period) {
      switch (newFilters.period) {
        case "week":
          startDate = now.clone().subtract(1, "weeks").format("YYYY-MM-DD");
          endDate = now.format("YYYY-MM-DD");
          break;
        case "month":
          startDate = now.clone().subtract(1, "months").format("YYYY-MM-DD");
          endDate = now.format("YYYY-MM-DD");
          break;
        case "year":
          startDate = now.clone().subtract(1, "years").format("YYYY-MM-DD");
          endDate = now.format("YYYY-MM-DD");
          break;
        case "future":
          startDate = now.format("YYYY-MM-DD");
          endDate = null;
          break;
        default:
          startDate = null;
          endDate = null;
      }

      if (startDate && endDate) {
        result = result.filter((transaction) =>
            moment(transaction.created_at).isBetween(
                startDate,
                endDate,
                null,
                "[]"
            )
        );
      } else if (startDate && !endDate) {
        result = result.filter((transaction) =>
            moment(transaction.created_at).isAfter(startDate)
        );
      }
    }

    if (newFilters.customRange.length === 2) {
      startDate = newFilters.customRange[0].format("YYYY-MM-DD");
      endDate = newFilters.customRange[1].format("YYYY-MM-DD");
      result = result.filter((transaction) =>
          moment(transaction.created_at).isBetween(startDate, endDate, null, "[]")
      );
    }

    if (newFilters.category) {
      result = result.filter(
          (transaction) => transaction.category.name === newFilters.category
      );
    }

    if (newFilters.amount) {
      result = result.filter((transaction) => {
        if (newFilters.amount === "low") return transaction.amount < 50;
        if (newFilters.amount === "medium")
          return transaction.amount >= 50 && transaction.amount < 200;
        if (newFilters.amount === "high") return transaction.amount >= 200;
        return true;
      });
    }

    if (newFilters.username) {
      result = result.filter((transaction) =>
          transaction.user.username
              .toLowerCase()
              .includes(newFilters.username.toLowerCase())
      );
    }

    setFilteredTransactions(result);
  };

  const handleSubmit = async (values) => {
    try {
      const { categoryName, orderdate, ...otherValues } = values;
      const selectedCategory = categories.find(
          (category) => category.name === categoryName
      );

      if (!selectedCategory) {
        message.error("Selected category not found");
        return;
      }

      const transactionData = {
        category: selectedCategory,
        created_at: moment(orderdate).format("YYYY-MM-DD"),
        ...otherValues,
      };

      let response;
      if (currentTransaction) {
        response = await axios.put(
            `http://localhost:8080/User/transaction/update/${currentTransaction.id}`,
            transactionData
        );
        message.success("Transaction updated successfully");
        setTransactions((prevTransactions) =>
            prevTransactions.map((tx) =>
                tx.id === currentTransaction.id ? response.data : tx
            )
        );
      }

      await loadTransactions();
      setModalOpen(false);
      form.resetFields();
      setCurrentTransaction(null);
    } catch (error) {
      console.error("Error creating/updating transaction:", error);
      message.error("Error creating/updating transaction");
    }
  };

  const handleFilterClick = (type, value) => {
    let newFilters = { ...filters };

    if (type === "period") {
      newFilters.period = filters.period === value ? "" : value;
      newFilters.customRange = [];
      setActiveFilter(newFilters.period === "" ? "" : value);
    } else if (type === "category") {
      newFilters.category = filters.category === value ? "" : value;
    } else if (type === "amount") {
      newFilters.amount = filters.amount === value ? null : value;
    } else if (type === "username") {
      newFilters.username = value;
    }

    setFilters(newFilters);
    filterTransactions(newFilters);
  };

  const handleDateRangeChange = (dates) => {
    let newFilters = { ...filters };
    if (dates && dates.length === 2) {
      newFilters.customRange = dates;
      newFilters.period = "custom";
      setActiveFilter("custom");
    } else {
      newFilters.customRange = [];
      newFilters.period = "";
      setActiveFilter("");
    }
    setFilters(newFilters);
    filterTransactions(newFilters);
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "transactionid",
      width: 150,
    },
    {
      title: "Username",
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "categoryName",
    },
    {
      title: "Amount(SGD)",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Order Date",
      dataIndex: "created_at",
      key: "orderdate",
      render: (text) => {
        const formattedDate = moment(text).isValid()
            ? moment(text).format("DD-MM-YYYY")
            : "/";
        return formattedDate;
      },
    },
    {
      title: "Update Time",
      dataIndex: "updated_at",
      key: "updateTime",
      render: (text) => {
        const formattedDate = moment(text).isValid()
            ? moment(text).format("DD-MM-YYYY")
            : "/";
        return formattedDate;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
      <div className="content">
        <h2>Expenses Management</h2>
        <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: "16px",
            }}
        >
          <Button
              onClick={() => handleFilterClick("period", "week")}
              type={activeFilter === "week" ? "primary" : "default"}
          >
            Last week
          </Button>
          <Button
              onClick={() => handleFilterClick("period", "month")}
              style={{ marginLeft: "8px" }}
              type={activeFilter === "month" ? "primary" : "default"}
          >
            Last month
          </Button>
          <Button
              onClick={() => handleFilterClick("period", "year")}
              style={{ marginLeft: "8px" }}
              type={activeFilter === "year" ? "primary" : "default"}
          >
            Last year
          </Button>
          <Button
              onClick={() => handleFilterClick("period", "future")}
              style={{ marginLeft: "8px" }}
              type={activeFilter === "future" ? "primary" : "default"}
          >
            Future
          </Button>
          <RangePicker
              onChange={handleDateRangeChange}
              style={{ marginLeft: "8px" }}
          />
          <Search
              placeholder="Search by Username"
              onSearch={(value) => handleFilterClick("username", value)}
              style={{ width: 200, marginLeft: "8px" }}
          />
          <Select
              onChange={(value) => handleFilterClick("category", value)}
              value={filters.category}
              placeholder="Select Category"
              style={{ marginLeft: "8px" }}
          >
            <Option value="">All Categories</Option>
            {categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
            ))}
          </Select>

          <Select
              onChange={(value) => handleFilterClick("amount", value)}
              value={filters.amount}
              placeholder="Select Amount"
              style={{ marginLeft: "8px" }}
          >
            <Option value={null}>All Amounts</Option>
            <Option value="low">0~50SGD</Option>
            <Option value="medium">50~200SGD</Option>
            <Option value="high">>200SGD</Option>
          </Select>

          <Button
              type="primary"
              style={{
                marginLeft: "auto",
                backgroundColor: "#ff0000",
                border: "none",
              }}
          >
            <CSVLink
                data={transactions}
                headers={headers}
                filename={"transactions.csv"}
                className="csv-link"
                target="_blank"
                style={{ textDecoration: "none", color: "white" }}
            >
              Export CSV
            </CSVLink>
          </Button>
        </div>
        <Table dataSource={filteredTransactions} columns={columns} rowKey="id" />

        <Modal
            title={currentTransaction ? "Edit Expense" : "Add Expense"}
            open={modalOpen}
            onCancel={() => {
              setModalOpen(false);
              setCurrentTransaction(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
            okText="Save"
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
                label="Category"
                name="categoryName"
                rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select>
                {categories.map((category) => (
                    <Option key={category.id} value={category.name}>
                      {category.name}
                    </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: "Please enter the amount!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
                label="Order Date"
                name="orderdate"
                rules={[
                  { required: true, message: "Please enter the order date!" },
                ]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Please enter a description!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default View_Transactions;