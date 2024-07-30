import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Home from './Home';
import BudgetSet from './components/user/BudgetSet';
import NavBar from './components/user/NavBar';

const { Header, Content } = Layout;

const App = () => {
  return ( <Router>
      <Layout>
        <Header>
          <NavBar />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content" style={{ margin: '16px 0' }}>
            <Routes>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/budgetset" element={<BudgetSet />} />
              <Route path="/logout" element={<div>Logout</div>} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;