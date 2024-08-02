import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import moment from 'moment'; // 引入 moment 库

const { Option } = Select;

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const userId = 1; // 假设你已经获取了当前用户的ID

    useEffect(() => {
        loadTransactions();
        loadCategories();
    }, []);

    const loadTransactions = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/User/transaction/${userId}`);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/User/budget/${userId}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const { categoryName, orderdate, ...otherValues } = values;
            const selectedCategory = categories.find(category => category.name === categoryName);

            if (!selectedCategory) {
                message.error('Selected category not found');
                return;
            }

            const transactionData = {
                category: selectedCategory,
                created_at: orderdate, // 将 orderdate 映射到 created_at
                ...otherValues
            };

            let response;
            if (currentTransaction) {
                response = await axios.put(`http://localhost:8080/User/transaction/update/${currentTransaction.id}`, transactionData);
                message.success('Transaction updated successfully');
                setTransactions(prevTransactions =>
                    prevTransactions.map(tx => (tx.id === currentTransaction.id ? response.data : tx))
                );
            } else {
                response = await axios.post(`http://localhost:8080/User/transaction/add/${userId}`, transactionData);
                message.success('Transaction created successfully');
                setTransactions(prevTransactions => [...prevTransactions, response.data]);
            }
            setModalOpen(false);
            form.resetFields();
            setCurrentTransaction(null);
        } catch (error) {
            console.error('Error creating/updating transaction:', error);
            message.error('Error creating/updating transaction');
        }
    };

    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction);
        form.setFieldsValue({
            categoryName: transaction.category.name,
            amount: transaction.amount,
            orderdate: moment(transaction.created_at).format('YYYY-MM-DD'), // 使用 moment 格式化日期
            description: transaction.description
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/User/transaction/delete/${id}`);
            message.success('Transaction deleted successfully');
            loadTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            message.error('Error deleting transaction');
        }
    };

    const columns = [
        {
            title: 'Category',
            dataIndex: ['category', 'name'],
            key: 'categoryName',
        },
        {
            title: 'Amount(SGD)',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Order Date',
            dataIndex: 'created_at',
            key: 'orderdate',
            render: (text) => text ? moment(text).format('YYYY-MM-DD') : '' // 格式化为 年-月-日
        },
        {
            title: 'Update Time',
            dataIndex: 'updated_at',
            key: 'updateTime',
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm') : '' // 格式化为 年-月-日 时:分
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
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
            )
        }
    ];

    return (
        <div className="content">
            <h2>Transaction Manager</h2>
            <Button type="primary" onClick={() => { setModalOpen(true); setCurrentTransaction(null); }}>Add Transaction</Button>
            <Table dataSource={transactions} columns={columns} rowKey="id" />

            <Modal
                title={currentTransaction ? "Edit Transaction" : "Add Transaction"}
                open={modalOpen}
                onCancel={() => { setModalOpen(false); setCurrentTransaction(null); form.resetFields(); }}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        label="Category"
                        name="categoryName"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select>
                            {categories.map(category => (
                                <Option key={category.id} value={category.name}>{category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: 'Please enter the amount!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Order Date"
                        name="orderdate"
                        rules={[{ required: true, message: 'Please enter the order date!' }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter a description!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Transaction;