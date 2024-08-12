import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import moment from "moment";
import { useUser } from "../../UserContext";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Transaction = () => {
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
  const [activeFilter, setActiveFilter] = useState(""); // 用于存储当前激活的筛选按钮
  const { userId } = useUser();

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, [userId]);

  const loadTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/User/transaction/${userId}`
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
      const response = await axios.get(
        `http://localhost:8080/User/budget/${userId}`
      );
      setCategories(response.data);
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

    setFilteredTransactions(result);
  };

  const handleFilterClick = (type, value) => {
    let newFilters = { ...filters };

    if (type === "period") {
      newFilters.period = filters.period === value ? "" : value;
      newFilters.customRange = []; // 清空自定义时间范围
      setActiveFilter(newFilters.period === "" ? "" : value);
    } else if (type === "category") {
      newFilters.category = filters.category === value ? "" : value;
    } else if (type === "amount") {
      newFilters.amount = filters.amount === value ? null : value;
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
        created_at: moment(orderdate).format("YYYY-MM-DD"), // 确保日期格式一致
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
      } else {
        response = await axios.post(
          `http://localhost:8080/User/transaction/add/${userId}`,
          transactionData
        );
        message.success("Transaction created successfully");
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          response.data,
        ]);
      }

      // 重新加载交易数据
      await loadTransactions();
      setModalOpen(false);
      form.resetFields();
      setCurrentTransaction(null);
    } catch (error) {
      console.error("Error creating/updating transaction:", error);
      message.error("Error creating/updating transaction");
    }
  };

  const handleEdit = (transaction) => {
    setCurrentTransaction(transaction);
    form.setFieldsValue({
      categoryName: transaction.category.name,
      amount: transaction.amount,
      orderdate: moment(transaction.created_at).format("YYYY-MM-DD"), // 使用 moment 格式化日期
      description: transaction.description,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/User/transaction/delete/${id}`);
      message.success("Transaction deleted successfully");
      loadTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      message.error("Error deleting transaction");
    }
  };

  const columns = [
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
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : ""), // 格式化为 年-月-日
    },
    {
      title: "Update Time",
      dataIndex: "updated_at",
      key: "updateTime",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD HH:mm") : ""), // 格式化为 年-月-日 时:分
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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

  return (
    <div className="content">
      <h2>Expense Manager</h2>
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

        {/* 类别筛选 */}
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

        {/* 金额筛选 */}
        <Select
          onChange={(value) => handleFilterClick("amount", value)}
          value={filters.amount}
          placeholder="Select Amount"
          style={{ marginLeft: "8px" }}
        >
          <Option value={null}>All Amounts</Option>
          <Option value="low">0~50SGD</Option>
          <Option value="medium">50~200SGD</Option>
          <Option value="high">200SGD</Option>
        </Select>
        <Button
          type="primary"
          onClick={() => {
            setModalOpen(true);
            setCurrentTransaction(null);
          }}
          style={{ marginLeft: "auto" }}
        >
          Add Expense
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

export default Transaction;
